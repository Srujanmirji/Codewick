import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';

// Smart Matching Algorithm
// Finds listings where: their skillOffered matches one of your skillsWanted
// AND/OR their skillWanted matches one of your skillsOffered
// Ranks by: complementary match strength + trust score

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.skillsOffered?.length && !user.skillsWanted?.length) {
      return NextResponse.json({ 
        matches: [], 
        message: 'Complete your profile to get smart matches.' 
      });
    }

    // Build regex patterns for fuzzy matching on skills
    const offeredPatterns = (user.skillsOffered || []).map(
      (s: string) => new RegExp(s.trim(), 'i')
    );
    const wantedPatterns = (user.skillsWanted || []).map(
      (s: string) => new RegExp(s.trim(), 'i')
    );

    // Find listings where:
    // - Their offered skill matches something I WANT  (they can teach me)
    // - Their wanted skill matches something I OFFER  (I can teach them)
    const allListings = await SkillListing.find({
      status: 'open',
      userId: { $ne: user._id }, // exclude own listings
    }).populate('userId', 'name avatarUrl trustScore trustLevel skillsOffered skillsWanted');

    // Score each listing
    const scored = allListings.map((listing) => {
      let score = 0;
      let matchReasons: string[] = [];

      // Check if their offered skill is something I want
      const theyTeachMeMatch = wantedPatterns.some(
        (pattern) => pattern.test(listing.skillOffered)
      );
      if (theyTeachMeMatch) {
        score += 50; // Strong signal — they can teach me what I want
        matchReasons.push(`teaches ${listing.skillOffered}`);
      }

      // Check if their wanted skill is something I can offer
      const iTeachThemMatch = offeredPatterns.some(
        (pattern) => pattern.test(listing.skillWanted)
      );
      if (iTeachThemMatch) {
        score += 40; // They want what I have
        matchReasons.push(`wants ${listing.skillWanted}`);
      }

      // Perfect complementary match (both directions)
      if (theyTeachMeMatch && iTeachThemMatch) {
        score += 30; // Bonus for perfect bilateral match
        matchReasons = [`Perfect match: ${listing.skillOffered} ↔ ${listing.skillWanted}`];
      }

      // Trust score bonus (higher trust = more reliable partner)
      const partnerTrust = (listing.userId as any)?.trustScore || 50;
      score += Math.floor(partnerTrust / 10); // 0-10 bonus points

      return {
        listing: listing.toObject(),
        matchScore: score,
        matchReasons,
        matchType: theyTeachMeMatch && iTeachThemMatch ? 'perfect' : 
                   theyTeachMeMatch ? 'they-teach-you' :
                   iTeachThemMatch ? 'you-teach-them' : 'none',
      };
    });

    // Filter out non-matches and sort by score descending
    const matches = scored
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Top 20 matches

    return NextResponse.json({
      matches,
      userSkills: {
        offered: user.skillsOffered,
        wanted: user.skillsWanted,
      },
      totalMatches: matches.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
