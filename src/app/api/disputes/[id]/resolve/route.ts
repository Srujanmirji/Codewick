import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { notifyDisputeResolved, notifyTrustChange } from '@/lib/notifications';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: disputeId } = await params;

    const dispute = await Dispute.findById(disputeId)
      .populate('filedBy', 'name trustScore')
      .populate('filedAgainst', 'name trustScore')
      .populate('sessionId');

    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    if (dispute.status === 'resolved') return NextResponse.json({ error: 'Already resolved' }, { status: 400 });

    const session = dispute.sessionId as any;

    // Build evidence context for AI
    const evidenceSection = dispute.evidenceUrls?.length 
      ? `\n      Evidence Attachments (${dispute.evidenceUrls.length} file(s) submitted by complainant)`
      : '';

    const counterSection = dispute.counterResponse 
      ? `\n      Counter-Response from Accused (${dispute.filedAgainst.name}):
      "${dispute.counterResponse}"
      ${dispute.counterEvidenceUrls?.length ? `Counter-Evidence: ${dispute.counterEvidenceUrls.length} file(s) submitted` : 'No counter-evidence submitted'}`
      : '\n      Note: The accused party did not submit a counter-response.';

    // AI Mediation Prompt — now considers BOTH sides
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are an AI Mediator for SkillSwap, a platform where users trade skills using "Time Credits".
      
      === COMPLAINANT'S CASE ===
      - Filed By: ${dispute.filedBy.name} (Trust Score: ${dispute.filedBy.trustScore})
      - Reason: ${dispute.reason}
      - Evidence Statement: "${dispute.evidence}"${evidenceSection}
      
      === ACCUSED'S CASE ===${counterSection}
      - Accused: ${dispute.filedAgainst.name} (Trust Score: ${dispute.filedAgainst.trustScore})
      
      === SESSION CONTEXT ===
      - Skill: ${session.listingId?.skillOffered || 'Skill Swap'}
      - Duration: ${session.duration} hours
      - Session Status: ${session.status}

      INSTRUCTIONS:
      You must consider BOTH sides fairly. If the accused provided a counter-response, weigh it against the complainant's evidence.
      A missing counter-response may indicate guilt OR simply that the user hasn't responded yet.
      
      Return ONLY a JSON object with these fields:
      - verdict: A 2-3 sentence explanation of your decision, referencing both sides if available.
      - refundAmount: Number of credits to refund to the learner (0 to ${session.duration}).
      - penaltyTrust: Trust score points to deduct from the offending party (0-20).
      - action: "refund" (give credits back + penalize), "dismiss" (no action, case unfounded), or "penalize" (deduct trust only).
      - confidence: "high", "medium", or "low" based on evidence quality.

      Consider if evidence shows no-show, poor quality, or bad behavior. Be fair and impartial.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const resolution = JSON.parse(jsonStr);

    // Apply Resolution
    dispute.resolution = resolution.verdict;
    dispute.status = 'resolved';
    dispute.resolvedAt = new Date();
    dispute.creditRefund = resolution.refundAmount;

    if (resolution.action === 'refund' && resolution.refundAmount > 0) {
      const provider = await User.findById(dispute.filedAgainst._id);
      const learner = await User.findById(dispute.filedBy._id);

      if (provider && learner) {
        provider.timeCredits -= resolution.refundAmount;
        learner.timeCredits += resolution.refundAmount;
        
        provider.trustScore = Math.max(0, provider.trustScore - resolution.penaltyTrust);
        
        // Update trust level
        if (provider.trustScore >= 90) provider.trustLevel = 'Elite';
        else if (provider.trustScore >= 75) provider.trustLevel = 'Trusted';
        else if (provider.trustScore >= 50) provider.trustLevel = 'Verified';
        else provider.trustLevel = 'Newbie';

        await provider.save();
        await learner.save();

        await Transaction.create({
          senderId: provider._id,
          receiverId: learner._id,
          amount: resolution.refundAmount,
          type: 'penalty',
          description: `Dispute Refund: ${resolution.verdict.substring(0, 80)}...`,
        });

        // Notify provider of the trust penalty
        await notifyTrustChange(
          provider._id.toString(),
          provider.trustScore + resolution.penaltyTrust,
          provider.trustScore,
          `Trust penalty from dispute resolution`
        );
      }
    } else if (resolution.action === 'penalize') {
       const provider = await User.findById(dispute.filedAgainst._id);
       if (provider) {
         provider.trustScore = Math.max(0, provider.trustScore - resolution.penaltyTrust);
         
         if (provider.trustScore >= 90) provider.trustLevel = 'Elite';
         else if (provider.trustScore >= 75) provider.trustLevel = 'Trusted';
         else if (provider.trustScore >= 50) provider.trustLevel = 'Verified';
         else provider.trustLevel = 'Newbie';
         
         await provider.save();

         // Notify provider of the trust penalty
         await notifyTrustChange(
           provider._id.toString(),
           provider.trustScore + resolution.penaltyTrust,
           provider.trustScore,
           `Trust penalty from dispute resolution`
         );
       }
    }

    await dispute.save();

    // Notify both parties of the resolution
    await notifyDisputeResolved(dispute.filedBy._id.toString(), dispute._id.toString(), resolution.verdict);
    await notifyDisputeResolved(dispute.filedAgainst._id.toString(), dispute._id.toString(), resolution.verdict);

    return NextResponse.json({ success: true, resolution });
  } catch (error: any) {
    console.error("AI Mediation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
