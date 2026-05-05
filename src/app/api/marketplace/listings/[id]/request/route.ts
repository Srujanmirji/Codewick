import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SkillRequest from '@/models/SkillRequest';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';
import Message from '@/models/Message';
import { checkFraud } from '@/lib/fraudDetection';

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

    const { message } = await request.json();
    const resolvedParams = await params;
    const listingId = resolvedParams.id;

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const listing = await SkillListing.findById(listingId).populate('userId', 'name');
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // Self-trading prevention
    if (listing.userId._id.toString() === user._id.toString()) {
      return NextResponse.json({ error: 'You cannot request your own listing' }, { status: 400 });
    }

    // Fraud Check
    const fraud = await checkFraud(user._id.toString(), listing.userId._id.toString(), 'request');
    if (fraud.isFraud) {
      return NextResponse.json({ error: fraud.message }, { status: 400 });
    }

    const skillRequest = await SkillRequest.create({
      listingId,
      requesterId: user._id,
      message,
      status: 'pending'
    });

    // Create conversation and send the swap request as a message
    const conversationId = [user._id.toString(), listing.userId._id.toString()].sort().join('_');

    await Message.create({
      conversationId,
      senderId: user._id,
      receiverId: listing.userId._id,
      text: message,
      type: 'swap-request',
      metadata: {
        listingId: listing._id.toString(),
        skillRequestId: skillRequest._id.toString(),
        skillOffered: listing.skillOffered,
        skillWanted: listing.skillWanted,
        creditCost: listing.creditCost,
        status: 'pending'
      }
    });

    // Update activity
    user.lastActiveAt = new Date();
    await user.save();

    return NextResponse.json(skillRequest);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
