import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await request.json();
    const mintAmount = parseFloat(amount);
    
    if (isNaN(mintAmount) || mintAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const targetUser = await User.findById(params.id);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    targetUser.timeCredits += mintAmount;
    await targetUser.save();

    await Transaction.create({
      senderId: (session.user as any).id, // Admin
      receiverId: targetUser._id,
      amount: mintAmount,
      type: 'bonus',
      description: `Admin Minted Promotional Bonus: ${mintAmount} TC`,
    });

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
