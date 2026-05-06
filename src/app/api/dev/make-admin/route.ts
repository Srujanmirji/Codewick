import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  // ONLY allow this on localhost for development safety
  const isLocal = process.env.NODE_ENV === "development";
  
  if (!isLocal) {
    return NextResponse.json({ error: "Only available in development mode" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  await connectToDatabase();

  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { isAdmin: true },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ 
    message: "You are now an Admin (God Mode Enabled)", 
    user: { email: user.email, isAdmin: user.isAdmin },
    instruction: "Please log out and log back in for changes to take effect in your session."
  });
}
