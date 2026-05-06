import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const listings = await SkillListing.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(listings);
  } catch (error: any) {
    console.error("Fetch listings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
