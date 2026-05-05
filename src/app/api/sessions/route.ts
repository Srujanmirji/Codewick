import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const sessions = await Session.find({
      $or: [{ providerId: mockUser._id }, { learnerId: mockUser._id }]
    })
    .populate('providerId', 'name avatarUrl')
    .populate('learnerId', 'name avatarUrl')
    .populate('listingId', 'skillOffered skillWanted')
    .sort({ scheduledAt: -1 });

    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
