import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Dispute from '@/models/Dispute';
import User from '@/models/User';

// Counter-response endpoint: lets the accused party submit their side
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: disputeId } = await params;
    const { counterResponse, counterEvidenceUrls } = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });

    // Only the accused party can respond
    if (dispute.filedAgainst.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Only the accused party can submit a counter-response' }, { status: 403 });
    }

    // Can only respond if status is awaiting-response
    if (dispute.status !== 'awaiting-response') {
      return NextResponse.json({ error: 'This dispute is no longer accepting responses' }, { status: 400 });
    }

    if (!counterResponse || counterResponse.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide your response' }, { status: 400 });
    }

    // Validate counter-evidence URLs
    const validUrls = (counterEvidenceUrls || []).filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }).slice(0, 5);

    dispute.counterResponse = counterResponse.trim();
    dispute.counterEvidenceUrls = validUrls;
    dispute.respondedAt = new Date();
    dispute.status = 'under-review'; // Now ready for AI mediation

    await dispute.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Your counter-response has been recorded. The dispute is now under review.',
      dispute 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
