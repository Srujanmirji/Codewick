import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';
import Notification from '@/models/Notification';
import Message from '@/models/Message';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { content } = await request.json();
    const { id } = await params;

    const question = await Question.findById(id);
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

    // Create Notification and Message
    if (question.author.toString() !== user._id.toString()) {
      await Notification.create({
        userId: question.author,
        title: "New Answer",
        type: "system",
        message: `${user.name} answered your question: "${question.title}"`,
        read: false
      });

      // Send Direct Message
      const conversationId = [question.author.toString(), user._id.toString()].sort().join('_');
      await Message.create({
        conversationId,
        senderId: user._id,
        receiverId: question.author,
        text: `I just posted an answer to your community question "${question.title}":\n\n"${content.substring(0, 150)}${content.length > 150 ? '...' : ''}"`,
        type: 'text'
      });
    }

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
