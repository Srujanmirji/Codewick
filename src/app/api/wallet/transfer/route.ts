import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { receiverEmail, amount, description } = await request.json();

    if (!receiverEmail || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid transfer details' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sender = await User.findOne({ email: session.user.email });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender) return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    if (!receiver) return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });

    if (sender.timeCredits < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Atomic transaction (using a session would be better, but requires replica set)
    // For simplicity here, we use manual updates
    
    sender.timeCredits -= amount;
    receiver.timeCredits += amount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      senderId: sender._id,
      receiverId: receiver._id,
      amount,
      type: 'spent',
      description: description || `Transfer to ${receiver.name}`,
    });

    // Create a corresponding 'earned' transaction for the receiver record
    // Usually one record is enough, but to follow the list logic:
    // We already have senderId and receiverId in one record.

    return NextResponse.json({ 
      success: true, 
      balance: sender.timeCredits,
      transaction 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
