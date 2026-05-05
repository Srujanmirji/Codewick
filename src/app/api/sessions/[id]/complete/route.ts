import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { notifySessionCompleted } from '@/lib/notifications';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const sessionAuth = await getServerSession(authOptions);

    if (!sessionAuth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const user = await User.findOne({ email: sessionAuth.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Identify if user is provider or learner and set confirmation
    if (session.providerId.toString() === user._id.toString()) {
      session.providerConfirmed = true;
    } else if (session.learnerId.toString() === user._id.toString()) {
      session.learnerConfirmed = true;
    } else {
      return NextResponse.json({ error: 'Not a participant of this session' }, { status: 403 });
    }

    // If both confirmed, mark as completed AND transfer credits
    if (session.providerConfirmed && session.learnerConfirmed) {
      session.status = 'completed';
      session.completedAt = new Date();

      // --- TIME-CREDIT TRANSFER ---
      // Determine credit amount from the listing, fallback to session duration
      let creditAmount = session.duration; // default: 1 credit per hour

      const listing = await SkillListing.findById(session.listingId);
      if (listing) {
        creditAmount = listing.creditCost || session.duration;
      }

      const provider = await User.findById(session.providerId);
      const learner = await User.findById(session.learnerId);

      if (!provider || !learner) {
        return NextResponse.json({ error: 'Session participants not found' }, { status: 404 });
      }

      // Check learner has sufficient balance
      if (learner.timeCredits < creditAmount) {
        return NextResponse.json({ 
          error: `Insufficient credits. ${learner.name} needs ${creditAmount} credits but only has ${learner.timeCredits}.` 
        }, { status: 400 });
      }

      // Transfer credits: learner pays, provider earns
      learner.timeCredits -= creditAmount;
      provider.timeCredits += creditAmount;

      // Update last active timestamps
      learner.lastActiveAt = new Date();
      provider.lastActiveAt = new Date();

      await learner.save();
      await provider.save();

      // Create transaction records for both parties
      await Transaction.create({
        senderId: learner._id,
        receiverId: provider._id,
        amount: creditAmount,
        type: 'spent',
        description: `Session payment: ${listing?.skillOffered || 'Skill Swap'}`,
      });

      await Transaction.create({
        senderId: learner._id,
        receiverId: provider._id,
        amount: creditAmount,
        type: 'earned',
        description: `Session earned: ${listing?.skillOffered || 'Skill Swap'}`,
      });

      // Mark listing as completed if applicable
      if (listing && listing.status === 'in-progress') {
        listing.status = 'completed';
        await listing.save();
      }

      // Send notifications to both parties
      await notifySessionCompleted(learner._id.toString(), session._id.toString(), listing?.skillOffered || 'Skill Swap', -creditAmount);
      await notifySessionCompleted(provider._id.toString(), session._id.toString(), listing?.skillOffered || 'Skill Swap', creditAmount);

    } else if (session.status === 'scheduled') {
      session.status = 'in-progress';
    }

    await session.save();

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
