import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import SkillListing from '@/models/SkillListing';
import User from '@/models/User';
import { redisCache } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || 'guest';

    // 1. Check Cache First
    const cacheKey = `marketplace:${userEmail}:q=${query}:c=${category}`;
    const cachedListings = await redisCache.get(cacheKey);
    if (cachedListings) {
      console.log(`[CACHE HIT] Marketplace: ${cacheKey}`);
      return NextResponse.json(cachedListings);
    }
    console.log(`[CACHE MISS] Marketplace: ${cacheKey}`);

    await connectDB();

    let filter: any = { status: 'open' };
    
    // Filter out the current user's own listings
    if (session?.user) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        filter.userId = { $ne: user._id };
      }
    }

    // Category filter
    if (category && category !== 'All Skills') {
      const categoryKeywords: Record<string, string[]> = {
        'Design': ['design', 'ui', 'ux', 'figma', 'graphic', 'logo', 'illustration', 'photoshop', 'css', 'tailwind', 'branding', 'wireframe'],
        'Development': ['development', 'coding', 'programming', 'react', 'next', 'node', 'javascript', 'typescript', 'python', 'java', 'api', 'web', 'app', 'full-stack', 'frontend', 'backend', 'html', 'database', 'sql', 'mongodb'],
        'Marketing': ['marketing', 'seo', 'social media', 'ads', 'content', 'copywriting', 'email', 'growth', 'analytics', 'branding', 'strategy'],
        'Languages': ['language', 'english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'arabic', 'hindi', 'korean', 'translation', 'speaking', 'writing'],
        'Business': ['business', 'finance', 'accounting', 'management', 'startup', 'entrepreneurship', 'excel', 'powerpoint', 'leadership', 'consulting', 'project management'],
        'Photography': ['photography', 'photo', 'camera', 'lightroom', 'editing', 'video', 'film', 'cinematography', 'drone', 'portrait'],
      };

      const keywords = categoryKeywords[category] || [category.toLowerCase()];
      const keywordRegex = keywords.join('|');

      filter.$or = [
        { category: category },
        { skillOffered: { $regex: keywordRegex, $options: 'i' } },
        { skillWanted: { $regex: keywordRegex, $options: 'i' } },
        { description: { $regex: keywordRegex, $options: 'i' } }
      ];
    }

    if (query) {
      const searchConditions = [
        { skillOffered: { $regex: query, $options: 'i' } },
        { skillWanted: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];

      if (filter.$or) {
        const categoryOr = filter.$or;
        delete filter.$or;
        filter.$and = [
          { $or: categoryOr },
          { $or: searchConditions }
        ];
      } else {
        filter.$or = searchConditions;
      }
    }

    const listings = await SkillListing.find(filter)
      .populate('userId', 'name avatarUrl trustScore')
      .sort({ createdAt: -1 });

    // 2. Save to Cache for 60 seconds
    await redisCache.set(cacheKey, listings, 60);

    return NextResponse.json(listings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const listing = await SkillListing.create({
      ...body,
      userId: user._id,
      status: 'open'
    });

    // 3. Invalidate Marketplace Cache globally
    await redisCache.delByPrefix('marketplace:');

    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
