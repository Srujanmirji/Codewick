import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';

// GET: Fetch all conversations for the current user
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const userId = user._id;

    // Get all unique conversations for this user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId', 'name image avatarUrl')
    .populate('receiverId', 'name image avatarUrl')
    .sort({ createdAt: -1 });

    // Group by conversationId and get the latest message + partner info
    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      if (!conversationsMap.has(msg.conversationId)) {
        const partner = msg.senderId._id.toString() === userId.toString()
          ? msg.receiverId
          : msg.senderId;

        const unreadCount = await Message.countDocuments({
          conversationId: msg.conversationId,
          receiverId: userId,
          read: false
        });

        conversationsMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          partner: {
            _id: partner._id,
            name: partner.name,
            avatar: partner.image || partner.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.name}`,
          },
          lastMessage: msg.text,
          lastMessageType: msg.type,
          lastMessageTime: msg.createdAt,
          unread: unreadCount,
        });
      }
    }

    return NextResponse.json(Array.from(conversationsMap.values()));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send a new message
export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { receiverId, text, type, metadata } = await request.json();

    if (!receiverId || !text) {
      return NextResponse.json({ error: 'receiverId and text are required' }, { status: 400 });
    }

    const conversationId = [user._id.toString(), receiverId].sort().join('_');

    const message = await Message.create({
      conversationId,
      senderId: user._id,
      receiverId,
      text,
      type: type || 'text',
      metadata: metadata || undefined,
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
