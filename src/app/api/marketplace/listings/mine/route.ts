import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const listings = await SkillListing.find({ userId: mockUser._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(listings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
