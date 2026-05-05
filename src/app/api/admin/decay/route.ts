import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Dispute from '@/models/Dispute';

export async function POST() {
  try {
    await connectDB();
    const usersList = await User.find(); 
    const now = new Date();
    
    let processedCount = 0;

    for (const user of usersList) {
      let decayAmount = 0;
      
      // Activity Decay
      const daysSinceActive = Math.floor((now.getTime() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActive >= 60) {
        decayAmount += 10;
      } else if (daysSinceActive >= 30) {
        decayAmount += 5;
      }

      // Dispute Decay
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const unresolvedDisputes = await Dispute.countDocuments({
        filedAgainst: user._id,
        status: { $ne: 'resolved' },
        createdAt: { $lt: sevenDaysAgo }
      });
      
      decayAmount += unresolvedDisputes * 3;

      if (decayAmount > 0) {
        user.trustScore = Math.max(0, user.trustScore - decayAmount);
        
        // Update trust level
        if (user.trustScore >= 90) user.trustLevel = 'Elite';
        else if (user.trustScore >= 75) user.trustLevel = 'Trusted';
        else if (user.trustScore >= 50) user.trustLevel = 'Verified';
        else user.trustLevel = 'Newbie';

        await user.save();
        processedCount++;
      }
    }

    return NextResponse.json({ success: true, processedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
