import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Dispute from '@/models/Dispute';
import { notifyTrustChange } from '@/lib/notifications';

// Vercel Cron config — run daily at midnight UTC
// Add to vercel.json: { "crons": [{ "path": "/api/cron/decay", "schedule": "0 0 * * *" }] }

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In production, verify the secret. In dev, allow direct access.
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const usersList = await User.find();
    const now = new Date();
    
    let processedCount = 0;
    const decayLog: { user: string; decay: number; reason: string }[] = [];

    for (const user of usersList) {
      let decayAmount = 0;
      const reasons: string[] = [];
      
      // --- ACTIVITY DECAY ---
      // Users who haven't been active lose trust over time
      if (user.lastActiveAt) {
        const daysSinceActive = Math.floor(
          (now.getTime() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceActive >= 90) {
          decayAmount += 15;
          reasons.push(`Inactive ${daysSinceActive}d (-15)`);
        } else if (daysSinceActive >= 60) {
          decayAmount += 10;
          reasons.push(`Inactive ${daysSinceActive}d (-10)`);
        } else if (daysSinceActive >= 30) {
          decayAmount += 5;
          reasons.push(`Inactive ${daysSinceActive}d (-5)`);
        }
      }

      // --- DISPUTE DECAY ---
      // Unresolved disputes older than 7 days erode trust
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const unresolvedDisputes = await Dispute.countDocuments({
        filedAgainst: user._id,
        status: { $ne: 'resolved' },
        createdAt: { $lt: sevenDaysAgo }
      });
      
      if (unresolvedDisputes > 0) {
        const disputeDecay = unresolvedDisputes * 3;
        decayAmount += disputeDecay;
        reasons.push(`${unresolvedDisputes} unresolved dispute(s) (-${disputeDecay})`);
      }

      // --- APPLY DECAY ---
      if (decayAmount > 0) {
        const oldScore = user.trustScore;
        user.trustScore = Math.max(0, user.trustScore - decayAmount);
        
        // Update trust level tier
        if (user.trustScore >= 90) user.trustLevel = 'Elite';
        else if (user.trustScore >= 75) user.trustLevel = 'Trusted';
        else if (user.trustScore >= 50) user.trustLevel = 'Verified';
        else user.trustLevel = 'Newbie';

        await user.save();
        processedCount++;

        const reasonStr = reasons.join(', ');
        decayLog.push({
          user: user.name || user.email,
          decay: decayAmount,
          reason: reasonStr
        });

        // Notify user of trust score decay
        await notifyTrustChange(
          user._id.toString(),
          oldScore,
          user.trustScore,
          `Reputation decay: ${reasonStr}`
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      processedCount,
      totalUsers: usersList.length,
      decayLog,
      executedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Cron decay error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
