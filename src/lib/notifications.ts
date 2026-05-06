import Notification from '@/models/Notification';

// Helper to create trust change notifications
export async function notifyTrustChange(
  userId: string,
  oldScore: number,
  newScore: number,
  reason: string
) {
  const changeAmount = newScore - oldScore;
  const direction = changeAmount > 0 ? 'increased' : 'decreased';
  const emoji = changeAmount > 0 ? '📈' : '📉';

  await Notification.create({
    userId,
    type: 'trust-change',
    title: `${emoji} Trust Score ${direction}`,
    message: `Your trust score ${direction} by ${Math.abs(changeAmount)} points (${oldScore} → ${newScore}). Reason: ${reason}`,
    metadata: { oldScore, newScore, changeAmount },
  });
}

// Helper for dispute notifications
export async function notifyDisputeFiled(
  accusedUserId: string,
  disputeId: string,
  reason: string
) {
  await Notification.create({
    userId: accusedUserId,
    type: 'dispute-filed',
    title: '⚠️ Dispute Filed Against You',
    message: `A dispute has been filed: "${reason}". You have 48 hours to submit your counter-response before AI mediation proceeds automatically.`,
    metadata: { disputeId },
  });
}

export async function notifyDisputeEscalated(
  disputeId: string,
  reason: string
) {
  const User = (await import('@/models/User')).default;
  const admins = await User.find({ isAdmin: true });
  
  for (const admin of admins) {
    await Notification.create({
      userId: admin._id.toString(),
      type: 'dispute-escalated',
      title: '🚨 Dispute Escalated — Admin Review Needed',
      message: `AI confidence too low to auto-resolve. Reason: "${reason}". Please review manually.`,
      metadata: { disputeId },
    });
  }
}

export async function notifyDisputeResolved(
  userId: string,
  disputeId: string,
  verdict: string
) {
  await Notification.create({
    userId,
    type: 'dispute-resolved',
    title: '⚖️ Dispute Resolved',
    message: verdict.length > 120 ? verdict.substring(0, 120) + '...' : verdict,
    metadata: { disputeId },
  });
}

// Helper for session completion
export async function notifySessionCompleted(
  userId: string,
  sessionId: string,
  skillName: string,
  creditsEarned: number
) {
  await Notification.create({
    userId,
    type: 'session-completed',
    title: '✅ Session Completed',
    message: `Your "${skillName}" session is complete! ${creditsEarned > 0 ? `You earned ${creditsEarned} credits.` : `${Math.abs(creditsEarned)} credits were transferred.`}`,
    metadata: { sessionId, changeAmount: creditsEarned },
  });
}
