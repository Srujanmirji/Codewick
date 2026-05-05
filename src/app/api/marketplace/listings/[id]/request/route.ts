import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SkillRequest from '@/models/SkillRequest';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';
import { checkFraud } from '@/lib/fraudDetection';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { message } = await request.json();
    const listingId = params.id;

    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const listing = await SkillListing.findById(listingId);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // Fraud Check
    const fraud = await checkFraud(mockUser._id.toString(), listing.userId.toString(), 'request');
    if (fraud.isFraud) {
      return NextResponse.json({ error: fraud.message }, { status: 400 });
    }

    const skillRequest = await SkillRequest.create({
      listingId,
      requesterId: mockUser._id,
      message,
      status: 'pending'
    });

    // Update activity
    mockUser.lastActiveAt = new Date();
    await mockUser.save();

    return NextResponse.json(skillRequest);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
