import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import SkillListing from '@/models/SkillListing';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const regex = new RegExp(query, 'i');

    // Parallel search for better performance
    const [users, listings] = await Promise.all([
      User.find({
        $or: [
          { name: { $regex: regex } },
          { skillsOffered: { $regex: regex } },
          { bio: { $regex: regex } }
        ]
      }).limit(5).select('name avatarUrl trustScore skillsOffered'),
      
      SkillListing.find({
        status: 'open',
        $or: [
          { skillOffered: { $regex: regex } },
          { skillWanted: { $regex: regex } },
          { description: { $regex: regex } }
        ]
      }).limit(5).populate('userId', 'name avatarUrl')
    ]);

    const results = [
      ...users.map(u => ({ type: 'user', id: u._id, title: u.name, subtitle: u.skillsOffered.join(', '), image: u.avatarUrl, href: `/dashboard/profile/${u._id}` })),
      ...listings.map(l => ({ type: 'listing', id: l._id, title: l.skillOffered, subtitle: `Wants: ${l.skillWanted}`, image: (l.userId as any)?.avatarUrl, href: `/dashboard/marketplace` }))
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
