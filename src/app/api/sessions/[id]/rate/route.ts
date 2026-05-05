import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { checkFraud } from '@/lib/fraudDetection';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { rating, review } = await request.json();
    const sessionId = params.id;

    const mockUser = await User.findOne({ email: 'alex@skillswap.local' });
    if (!mockUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const partnerId = session.providerId.toString() === mockUser._id.toString() 
      ? session.learnerId.toString() 
      : session.providerId.toString();

    // Fraud Check
    const fraud = await checkFraud(mockUser._id.toString(), partnerId, 'rate');
    if (fraud.isFraud) {
      return NextResponse.json({ error: fraud.message }, { status: 400 });
    }

    // Handle rating submission
    if (session.providerId.toString() === mockUser._id.toString()) {
      // Provider rating the learner
      session.learnerRating = rating;
      session.learnerReview = review;
    } else if (session.learnerId.toString() === mockUser._id.toString()) {
      // Learner rating the provider
      session.providerRating = rating;
      session.providerReview = review;

      // Update Provider's Trust Score immediately when learner rates them
      const provider = await User.findById(session.providerId);
      if (provider) {
        let newTrust = provider.trustScore + (rating - 3) * 5;
        provider.trustScore = Math.max(0, Math.min(100, newTrust));
        
        // Update trust level
        if (provider.trustScore >= 90) provider.trustLevel = 'Elite';
        else if (provider.trustScore >= 75) provider.trustLevel = 'Trusted';
        else if (provider.trustScore >= 50) provider.trustLevel = 'Verified';
        else provider.trustLevel = 'Newbie';

        await provider.save();
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    mockUser.lastActiveAt = new Date();
    await mockUser.save();

    await session.save();

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
