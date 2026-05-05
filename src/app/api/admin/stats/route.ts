import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Dispute from '@/models/Dispute';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalUsers = await User.countDocuments();
    const totalDisputes = await Dispute.countDocuments();
    const activeDisputes = await Dispute.countDocuments({ status: { $ne: 'resolved' } });
    
    const users = await User.find({}, 'timeCredits');
    const totalTimeCredits = users.reduce((acc, user) => acc + (user.timeCredits || 0), 0);

    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(10);
    const disputesList = await Dispute.find({ status: { $ne: 'resolved' } })
      .populate('filedBy', 'name')
      .populate('filedAgainst', 'name');
      
    const allUsers = await User.find().select('name email timeCredits trustScore isBanned isAdmin createdAt').sort({ createdAt: -1 });

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalTimeCredits,
        totalDisputes,
        activeDisputes
      },
      recentTransactions,
      disputes: disputesList,
      users: allUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
