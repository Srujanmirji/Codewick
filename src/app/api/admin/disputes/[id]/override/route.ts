import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import Session from '@/models/Session';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const sessionAuth = await getServerSession(authOptions);
    if (!sessionAuth?.user?.email || !(sessionAuth.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resolutionDetails } = await request.json();

    const dispute = await Dispute.findById(params.id);
    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });

    dispute.status = 'resolved';
    dispute.aiVerdict = `Admin Override: ${resolutionDetails}`; // Reusing field for admin note
    await dispute.save();

    const skillSession = await Session.findById(dispute.sessionId);
    if (skillSession) {
      skillSession.status = 'completed'; // Force complete
      await skillSession.save();
    }

    return NextResponse.json({ success: true, dispute });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
