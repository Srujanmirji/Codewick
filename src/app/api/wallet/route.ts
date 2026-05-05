import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();

    // In a real app, you would get the user ID from the session/auth
    // For now, we'll fetch the first user or create a mock one if none exists
    let user = await User.findOne();
    
    if (!user) {
      user = await User.create({
        name: 'Alex Developer',
        email: 'alex@skillswap.local',
        timeCredits: 2,
        trustScore: 50,
        trustLevel: 'Newbie'
      });
      
      // Initial bonus transaction
      await Transaction.create({
        receiverId: user._id,
        amount: 2,
        type: 'bonus',
        description: 'Initial onboarding bonus',
      });
    }

    const transactions = await Transaction.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }]
    })
    .sort({ createdAt: -1 })
    .limit(10);

    return NextResponse.json({
      credits: user.timeCredits,
      trustScore: user.trustScore,
      transactions
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
