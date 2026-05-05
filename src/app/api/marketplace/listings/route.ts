import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let filter: any = { status: 'open' };
    
    // Filter out the current user's own listings
    if (session?.user) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        filter.userId = { $ne: user._id };
      }
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const listing = await SkillListing.create({
      ...body,
      userId: user._id,
      status: 'open'
    });

    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
