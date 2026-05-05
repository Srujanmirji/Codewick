import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Security check: If there is already an admin, disable this route.
    // const adminExists = await User.findOne({ isAdmin: true });
    // if (adminExists) {
    //   return NextResponse.json({ 
    //     error: 'An admin already exists. For security reasons, this setup route is now disabled.' 
    //   }, { status: 403 });
    // }

    // Get the email from the URL query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Please provide your email: /api/admin/setup?email=your@email.com' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found in the database. Please sign up first!' }, { status: 404 });
    }

    user.isAdmin = true;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: `Success! ${email} has been granted God Mode. Please log out and log back in to see the changes.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
