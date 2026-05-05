import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import { checkFraud } from '@/lib/fraudDetection';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const sessionAuth = await getServerSession(authOptions);

    if (!sessionAuth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, review } = await request.json();
    const { id: sessionId } = await params;

    const user = await User.findOne({ email: sessionAuth.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const session = await Session.findById(sessionId);
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const isProvider = session.providerId.toString() === user._id.toString();
    const isLearner = session.learnerId.toString() === user._id.toString();

    if (!isProvider && !isLearner) {
      return NextResponse.json({ error: 'Not a participant of this session' }, { status: 403 });
    }

    const partnerId = isProvider ? session.learnerId.toString() : session.providerId.toString();

    // Fraud Check
    const fraud = await checkFraud(user._id.toString(), partnerId, 'rate');
    if (fraud.isFraud) {
      return NextResponse.json({ error: fraud.message }, { status: 400 });
    }

    // Handle rating submission
    if (isProvider) {
      // Provider rating the learner
      session.learnerRating = rating;
      session.learnerReview = review;
    } else {
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
    }
    
    user.lastActiveAt = new Date();
    await user.save();

    await session.save();

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
