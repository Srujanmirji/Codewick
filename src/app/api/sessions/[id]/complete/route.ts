import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const sessionAuth = await getServerSession(authOptions);

    if (!sessionAuth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const user = await User.findOne({ email: sessionAuth.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Identify if user is provider or learner and set confirmation
    if (session.providerId.toString() === user._id.toString()) {
      session.providerConfirmed = true;
    } else if (session.learnerId.toString() === user._id.toString()) {
      session.learnerConfirmed = true;
    } else {
      return NextResponse.json({ error: 'Not a participant of this session' }, { status: 403 });
    }

    // If both confirmed, mark as completed
    if (session.providerConfirmed && session.learnerConfirmed) {
      session.status = 'completed';
      session.completedAt = new Date();
    } else if (session.status === 'scheduled') {
      session.status = 'in-progress';
    }

    await session.save();

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
