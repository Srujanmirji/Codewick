import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const sessionId = params.id;

    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Identify if user is provider or learner and set confirmation
    if (session.providerId.toString() === mockUser._id.toString()) {
      session.providerConfirmed = true;
    } else if (session.learnerId.toString() === mockUser._id.toString()) {
      session.learnerConfirmed = true;
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
