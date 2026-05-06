import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { notifyDisputeResolved, notifyDisputeEscalated, notifyTrustChange } from '@/lib/notifications';
import { mediateDispute } from '@/lib/disputeMediator';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find all disputes past their response deadline that haven't been responded to
    const expiredDisputes = await Dispute.find({
      status: 'awaiting-response',
      responseDeadline: { $lte: new Date() }
    })
    .populate('filedBy', 'name trustScore')
    .populate('filedAgainst', 'name trustScore');

    const results = [];

    for (const dispute of expiredDisputes) {
      // Move to under-review and trigger AI mediation
      dispute.status = 'under-review';
      await dispute.save();

      const resolution = await mediateDispute(dispute, true);

      // Feature 1: AI Confidence Tiers + Auto-Escalation
      if (resolution.confidence === 'low') {
        dispute.status = 'escalated';
        dispute.resolution = resolution.verdict;
        dispute.aiConfidence = resolution.confidence;
        await dispute.save();

        await notifyDisputeEscalated(dispute._id.toString(), dispute.reason);

        results.push({
          disputeId: dispute._id,
          reason: dispute.reason,
          action: 'auto-mediated -> escalated (deadline expired)'
        });
        continue;
      }

      // Apply Resolution normally
      dispute.resolution = resolution.verdict;
      dispute.status = 'resolved';
      dispute.aiConfidence = resolution.confidence || 'medium';
      dispute.resolvedAt = new Date();
      dispute.creditRefund = resolution.refundAmount || 0;

      if (resolution.action === 'refund' && resolution.refundAmount > 0) {
        const provider = dispute.filedAgainst ? await User.findById(dispute.filedAgainst._id) : null;
        const learner = dispute.filedBy ? await User.findById(dispute.filedBy._id) : null;

        if (provider && learner) {
          provider.timeCredits -= resolution.refundAmount;
          learner.timeCredits += resolution.refundAmount;
          
          provider.trustScore = Math.max(0, provider.trustScore - (resolution.penaltyTrust || 0));
          
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
            description: `Dispute Refund: ${(resolution.verdict || '').substring(0, 80)}...`,
          });

          await notifyTrustChange(
            provider._id.toString(),
            provider.trustScore + (resolution.penaltyTrust || 0),
            provider.trustScore,
            `Trust penalty from dispute resolution`
          );
        }
      } else if (resolution.action === 'penalize') {
         const provider = dispute.filedAgainst ? await User.findById(dispute.filedAgainst._id) : null;
         if (provider) {
           provider.trustScore = Math.max(0, provider.trustScore - (resolution.penaltyTrust || 0));
           
           if (provider.trustScore >= 90) provider.trustLevel = 'Elite';
           else if (provider.trustScore >= 75) provider.trustLevel = 'Trusted';
           else if (provider.trustScore >= 50) provider.trustLevel = 'Verified';
           else provider.trustLevel = 'Newbie';
           
           await provider.save();

           await notifyTrustChange(
             provider._id.toString(),
             provider.trustScore + (resolution.penaltyTrust || 0),
             provider.trustScore,
             `Trust penalty from dispute resolution`
           );
         }
      }

      await dispute.save();

      const safeVerdict = resolution.verdict || "Resolution decided.";
      if (dispute.filedBy) {
        await notifyDisputeResolved(dispute.filedBy._id.toString(), dispute._id.toString(), safeVerdict);
      }
      if (dispute.filedAgainst) {
        await notifyDisputeResolved(dispute.filedAgainst._id.toString(), dispute._id.toString(), safeVerdict);
      }
      
      results.push({
        disputeId: dispute._id,
        reason: dispute.reason,
        action: 'auto-mediated -> resolved (deadline expired)'
      });
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      disputes: results,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Dispute cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
