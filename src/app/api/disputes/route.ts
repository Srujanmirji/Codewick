import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const disputes = await Dispute.find({
      $or: [{ filedBy: mockUser._id }, { filedAgainst: mockUser._id }]
    })
    .populate('filedBy', 'name')
    .populate('filedAgainst', 'name')
    .populate('sessionId')
    .sort({ createdAt: -1 });

    return NextResponse.json(disputes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { sessionId, reason, evidence } = await request.json();

    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const filedAgainst = session.providerId.toString() === mockUser._id.toString() 
      ? session.learnerId 
      : session.providerId;

    const dispute = await Dispute.create({
      sessionId,
      filedBy: mockUser._id,
      filedAgainst,
      reason,
      evidence,
      status: 'open'
    });

    // Mark session as disputed
    session.status = 'disputed';
    await session.save();

    return NextResponse.json(dispute);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
