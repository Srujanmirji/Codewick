import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json(); // 'ban' or 'unban'
    const targetUser = await User.findById(params.id);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    targetUser.isBanned = action === 'ban';
    await targetUser.save();

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
