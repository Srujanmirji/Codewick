import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';
import User from '@/models/User';
import { notifyDisputeFiled } from '@/lib/notifications';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const disputes = await Dispute.find({
      $or: [{ filedBy: user._id }, { filedAgainst: user._id }]
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, reason, evidence, evidenceUrls } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const skillSession = await Session.findById(sessionId);
    if (!skillSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const filedAgainst = skillSession.providerId.toString() === user._id.toString() 
      ? skillSession.learnerId 
      : skillSession.providerId;

    // Validate evidence URLs if provided
    const validUrls = (evidenceUrls || []).filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }).slice(0, 5); // Max 5 evidence URLs

    const dispute = await Dispute.create({
      sessionId,
      filedBy: user._id,
      filedAgainst,
      reason,
      evidence,
      evidenceUrls: validUrls,
      responseDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h from now
      status: 'awaiting-response' // Wait for accused to respond first
    });

    // Mark session as disputed
    skillSession.status = 'disputed';
    await skillSession.save();

    // Notify the accused party
    await notifyDisputeFiled(filedAgainst.toString(), dispute._id.toString(), reason);

    return NextResponse.json(dispute);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
