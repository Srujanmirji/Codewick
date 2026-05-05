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

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { image, banner } = body;

    await connectToDatabase();

    const updateData: any = {};
    if (image !== undefined) updateData.image = image;
    if (banner !== undefined) updateData.banner = banner;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "An error occurred updating the profile" },
      { status: 500 }
    );
  }
}
