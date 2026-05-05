import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    const questions = await Question.find()
      .populate('author', 'name image trustScore')
      .sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { title, description, bounty, tags } = await request.json();

    const bountyAmount = parseFloat(bounty) || 0;

    if (bountyAmount > 0) {
      if (user.timeCredits < bountyAmount) {
        return NextResponse.json({ error: 'Insufficient time credits for this bounty' }, { status: 400 });
      }
      user.timeCredits -= bountyAmount;
      await user.save();
      
      // We log a transaction where sender is user and receiver is "escrow/system"
      // Wait, Transaction expects receiverId to be an ObjectId usually, but Schema allows Mixed or string depending on setup.
      // Let's use the user's own ID as receiver but type as "spent" and clarify in description.
      await Transaction.create({
        senderId: user._id,
        receiverId: user._id, // Just to satisfy schema
        amount: bountyAmount,
        type: 'spent',
        description: `Bounty placed in escrow for question: ${title}`,
      });
    }

    const question = await Question.create({
      author: user._id,
      title,
      description,
      bounty: bountyAmount,
      tags: tags || []
    });

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
