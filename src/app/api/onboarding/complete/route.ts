import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, name } = await request.json();

    let user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    user = await User.create({
      name,
      email,
      timeCredits: 2, // Initial 2 credits
      trustScore: 50,
      trustLevel: 'Newbie'
    });

    await Transaction.create({
      receiverId: user._id,
      amount: 2,
      type: 'bonus',
      description: 'Initial onboarding bonus',
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
