import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // In real app, get from session
    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    const mockUserId = mockUser?._id;

    let filter: any = { status: 'open' };
    if (mockUserId) {
      filter.userId = { $ne: mockUserId };
    }
    if (query) {
      filter.$or = [
        { skillOffered: { $regex: query, $options: 'i' } },
        { skillWanted: { $regex: query, $options: 'i' } }
      ];
    }

    const listings = await SkillListing.find(filter)
      .populate('userId', 'name avatarUrl trustScore')
      .sort({ createdAt: -1 });

    return NextResponse.json(listings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // In real app, get from session
    let mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    
    // Auto-create mock user if missing in the new database
    if (!mockUser) {
      mockUser = await User.create({
        name: 'Alex Developer',
        email: 'alex@skillswap.local',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        timeCredits: 10,
        trustScore: 85,
        trustLevel: 'Trusted'
      });
    }

    const listing = await SkillListing.create({
      ...body,
      userId: mockUser._id,
      status: 'open'
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
