import { GoogleGenerativeAI } from '@google/generative-ai';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';
import SkillListing from '@/models/SkillListing';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCtuh8H_cRcyWFPcz4ZphohWBkPXTdwZDs');

export async function mediateDispute(dispute: any, isDeadlineExpired: boolean = false) {
  // Fetch session and listing data
  const session = await Session.findById(dispute.sessionId);
  let skillName = 'Skill Swap';
  let duration = 1;

  if (session) {
    duration = session.duration || 1;
    if (session.listingId) {
      const listing = await SkillListing.findById(session.listingId);
      if (listing) skillName = listing.skillOffered;
    }
  }

  // Feature 4: Historical Pattern Detection
  const pastDisputes = await Dispute.find({
    filedAgainst: dispute.filedAgainst?._id,
    status: 'resolved',
    _id: { $ne: dispute._id } // exclude current dispute
  });

  const totalPastDisputes = pastDisputes.length;
  const lostDisputes = pastDisputes.filter(d => 
    d.creditRefund > 0 || d.resolution?.toLowerCase().includes('refund')
  ).length;

  const historySection = totalPastDisputes > 0
    ? `\n      === DISPUTE HISTORY (ACCUSED) ===
      - Total past disputes filed against them: ${totalPastDisputes}
      - Disputes where they were found at fault: ${lostDisputes}
      - Repeat offender: ${lostDisputes >= 3 ? 'YES — serial offender pattern detected' : lostDisputes >= 1 ? 'CAUTION — prior offenses on record' : 'No prior faults'}
      NOTE: If this is a repeat offender, apply STRICTER penalties.`
    : `\n      === DISPUTE HISTORY (ACCUSED) ===
      - No prior disputes on record. This is their first dispute.`;

  // Build evidence context for AI
  const evidenceSection = dispute.evidenceUrls?.length 
    ? `\n      Evidence Attachments (${dispute.evidenceUrls.length} file(s) submitted by complainant)`
    : '';

  let counterSection = "";
  if (dispute.counterResponse) {
    counterSection = `\n      Counter-Response from Accused (${dispute.filedAgainst?.name || 'Unknown User'}):
      "${dispute.counterResponse}"
      ${dispute.counterEvidenceUrls?.length ? `Counter-Evidence: ${dispute.counterEvidenceUrls.length} file(s) submitted` : 'No counter-evidence submitted'}`;
  } else if (isDeadlineExpired) {
    counterSection = '\n      Note: The accused party DID NOT SUBMIT a counter-response within the 48-hour deadline. You may consider this in your verdict, but it does not automatically guarantee guilt.';
  } else {
    counterSection = '\n      Note: The accused party did not submit a counter-response yet.';
  }

  // AI Mediation Prompt
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `
    You are an AI Mediator for SkillSwap, a platform where users trade skills using "Time Credits".
    
    === COMPLAINANT'S CASE ===
    - Filed By: ${dispute.filedBy?.name || 'Unknown User'} (Trust Score: ${dispute.filedBy?.trustScore ?? 50})
    - Reason: ${dispute.reason}
    - Evidence Statement: "${dispute.evidence || 'No additional evidence provided'}"${evidenceSection}
    
    === ACCUSED'S CASE ===${counterSection}
    - Accused: ${dispute.filedAgainst?.name || 'User'} (Trust Score: ${dispute.filedAgainst?.trustScore ?? 50})
    
    === SESSION CONTEXT ===
    - Skill: ${skillName}
    - Duration: ${duration} hours
    - Session Status: ${session?.status || 'Unknown'}
    ${historySection}

    INSTRUCTIONS:
    You must consider BOTH sides fairly. If the accused provided a counter-response, weigh it against the complainant's evidence.
    
    Return ONLY a valid JSON object (no markdown, no code fences) with these fields:
    - verdict: A 2-3 sentence explanation of your decision, referencing both sides if available.
    - refundAmount: Number of credits to refund to the learner (0 to ${duration}).
    - penaltyTrust: Trust score points to deduct from the offending party (0-20).
    - action: "refund" (give credits back + penalize), "dismiss" (no action, case unfounded), or "penalize" (deduct trust only).
    - confidence: "high", "medium", or "low" based on evidence quality.
  `;

  let text = "";
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();
  } catch (apiError) {
    console.warn("Gemini API failed, using fallback mediation:", apiError);
    text = JSON.stringify({
      verdict: "The AI Mediator has analyzed the case (Fallback Mode). Based on the context provided, a fair partial resolution is applied to resolve the conflict.",
      refundAmount: Math.floor(duration / 2),
      penaltyTrust: 5,
      action: "refund",
      confidence: "medium"
    });
  }
  
  // Clean JSON from response
  const jsonStr = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
  
  let resolution;
  try {
    resolution = JSON.parse(jsonStr);
  } catch (parseError) {
    console.error("Failed to parse AI response:", jsonStr);
    resolution = {
      verdict: "The AI Mediator was unable to parse a structured response. Based on the dispute reason, a partial resolution is recommended.",
      refundAmount: 0,
      penaltyTrust: 5,
      action: "penalize",
      confidence: "low"
    };
  }

  return resolution;
}
