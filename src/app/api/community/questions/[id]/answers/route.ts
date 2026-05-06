import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { content } = await request.json();

    const question = await Question.findById(params.id);
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    if (question.status === 'resolved') {
      return NextResponse.json({ error: 'Question is already resolved' }, { status: 400 });
    }

    question.answers.push({
      author: user._id,
      content,
      isAccepted: false,
    });

    await question.save();

    // Notify the question author (if it's not the author replying to themselves)
    if (question.author.toString() !== user._id.toString()) {
      const { notifyCommunityReply } = await import('@/lib/notifications');
      await notifyCommunityReply(
        question.author.toString(),
        question._id.toString(),
        question.title,
        user.name
      );
    }

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
