import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { answerId } = await request.json();

    const question = await Question.findById(params.id);
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    if (question.author.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Only the author can resolve this question' }, { status: 403 });
    }

    if (question.status === 'resolved') {
      return NextResponse.json({ error: 'Question is already resolved' }, { status: 400 });
    }

    const answer = question.answers.id(answerId);
    if (!answer) return NextResponse.json({ error: 'Answer not found' }, { status: 404 });

    answer.isAccepted = true;
    question.status = 'resolved';
    question.resolvedBy = answer.author;

    // Distribute bounty
    if (question.bounty > 0) {
      const solver = await User.findById(answer.author);
      if (solver) {
        solver.timeCredits += question.bounty;
        solver.trustScore = Math.min(100, solver.trustScore + 2); // bonus trust
        await solver.save();

        await Transaction.create({
          senderId: user._id,
          receiverId: solver._id,
          amount: question.bounty,
          type: 'earned',
          description: `Bounty earned for answering: ${question.title}`,
        });
      }
    }

    await question.save();

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
