import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: dbUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { message: "An error occurred fetching the profile" },
      { status: 500 }
    );
  }
}
