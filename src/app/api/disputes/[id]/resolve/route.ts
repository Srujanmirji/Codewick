import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const disputeId = params.id;

    const dispute = await Dispute.findById(disputeId)
      .populate('filedBy', 'name trustScore')
      .populate('filedAgainst', 'name trustScore')
      .populate('sessionId');

    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    if (dispute.status === 'resolved') return NextResponse.json({ error: 'Already resolved' }, { status: 400 });

    const session = dispute.sessionId as any;

    // AI Mediation Prompt
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are an AI Mediator for SkillSwap, a platform where users trade skills using "Time Credits".
      
      Dispute Details:
      - Reason: ${dispute.reason}
      - Evidence: ${dispute.evidence}
      
      Session Context:
      - Skill: ${session.listingId?.skillOffered || 'Skill Swap'}
      - Duration: ${session.duration} hours
      - Filed By: ${dispute.filedBy.name} (Trust Score: ${dispute.filedBy.trustScore})
      - Filed Against: ${dispute.filedAgainst.name} (Trust Score: ${dispute.filedAgainst.trustScore})

      Please analyze the dispute and provide a verdict. 
      Return ONLY a JSON object with the following fields:
      - verdict: A 2-3 sentence explanation of your decision.
      - refundAmount: Number of credits to refund to the learner (usually between 0 and 1).
      - penaltyTrust: Number of trust score points to deduct from the offending party (0-20).
      - action: "refund" (give credits back to learner), "dismiss" (no action), or "penalize" (deduct trust only).

      Consider if the evidence shows a lack of effort, no-show, or poor quality.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from response if necessary
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const resolution = JSON.parse(jsonStr);

    // Apply Resolution
    dispute.resolution = resolution.verdict;
    dispute.status = 'resolved';
    dispute.resolvedAt = new Date();
    dispute.creditRefund = resolution.refundAmount;

    if (resolution.action === 'refund' && resolution.refundAmount > 0) {
      // Refund logic: take from filedAgainst (provider) and give to filedBy (learner)
      const provider = await User.findById(dispute.filedAgainst._id);
      const learner = await User.findById(dispute.filedBy._id);

      if (provider && learner) {
        provider.timeCredits -= resolution.refundAmount;
        learner.timeCredits += resolution.refundAmount;
        
        provider.trustScore = Math.max(0, provider.trustScore - resolution.penaltyTrust);
        
        await provider.save();
        await learner.save();

        await Transaction.create({
          senderId: provider._id,
          receiverId: learner._id,
          amount: resolution.refundAmount,
          type: 'penalty',
          description: `Dispute Refund: ${resolution.verdict}`,
        });
      }
    } else if (resolution.action === 'penalize') {
       const provider = await User.findById(dispute.filedAgainst._id);
       if (provider) {
         provider.trustScore = Math.max(0, provider.trustScore - resolution.penaltyTrust);
         await provider.save();
       }
    }

    await dispute.save();

    return NextResponse.json({ success: true, resolution });
  } catch (error: any) {
    console.error("AI Mediation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
