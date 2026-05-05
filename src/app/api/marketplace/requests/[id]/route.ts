import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SkillRequest from '@/models/SkillRequest';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Session from '@/models/Session';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { status } = await request.json(); // 'accepted' or 'rejected'
    const { id: requestId } = await params;

    const skillRequest = await SkillRequest.findById(requestId);
    if (!skillRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    const listing = await SkillListing.findById(skillRequest.listingId);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    if (status === 'accepted') {
      const requester = await User.findById(skillRequest.requesterId);
      const provider = await User.findById(listing.userId);

      if (!requester || !provider) return NextResponse.json({ error: 'Users not found' }, { status: 404 });

      if (requester.timeCredits < listing.creditCost) {
        return NextResponse.json({ error: 'Requester has insufficient credits' }, { status: 400 });
      }

      // Perform transaction
      requester.timeCredits -= listing.creditCost;
      provider.timeCredits += listing.creditCost;

      await requester.save();
      await provider.save();

      // Update statuses
      listing.status = 'in-progress';
      await listing.save();

      skillRequest.status = 'accepted';
      await skillRequest.save();

      // Create Session
      await Session.create({
        listingId: listing._id,
        providerId: provider._id,
        learnerId: requester._id,
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 86400000), // Default to tomorrow
        duration: 1
      });

      // Log Transaction
      await Transaction.create({
        senderId: requester._id,
        receiverId: provider._id,
        amount: listing.creditCost,
        type: 'spent',
        description: `Swap accepted: ${listing.skillOffered} for ${listing.skillWanted}`,
      });

    } else if (status === 'rejected') {
      skillRequest.status = 'rejected';
      await skillRequest.save();
    }

    return NextResponse.json({ success: true, skillRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
