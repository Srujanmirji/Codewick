import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const sessions = await Session.find({
      $or: [{ providerId: dbUser._id }, { learnerId: dbUser._id }]
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
