import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { skillsOffered, skillsWanted, skillLevel, availability, bio, portfolioUrl } = await req.json();

    // Validate required fields
    if (!skillsOffered || skillsOffered.length === 0) {
      return NextResponse.json(
        { message: "Please add at least one skill you can offer" },
        { status: 400 }
      );
    }

    if (skillsOffered.length > 5) {
      return NextResponse.json(
        { message: "You can offer up to 5 skills" },
        { status: 400 }
      );
    }

    if (!skillsWanted || skillsWanted.length === 0) {
      return NextResponse.json(
        { message: "Please add at least one skill you want to learn" },
        { status: 400 }
      );
    }

    if (skillsWanted.length > 5) {
      return NextResponse.json(
        { message: "You can want up to 5 skills" },
        { status: 400 }
      );
    }

    if (!skillLevel || !['Beginner', 'Intermediate', 'Expert'].includes(skillLevel)) {
      return NextResponse.json(
        { message: "Please select a valid skill level" },
        { status: 400 }
      );
    }

    if (!availability || availability.length === 0) {
      return NextResponse.json(
        { message: "Please select at least one availability option" },
        { status: 400 }
      );
    }

    if (!bio || bio.trim().length === 0) {
      return NextResponse.json(
        { message: "Please write a short bio" },
        { status: 400 }
      );
    }

    if (bio.length > 120) {
      return NextResponse.json(
        { message: "Bio cannot exceed 120 characters" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        skillsOffered,
        skillsWanted,
        skillLevel,
        availability,
        bio: bio.trim(),
        portfolioUrl: portfolioUrl?.trim() || undefined,
        onboardingComplete: true,
      },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Onboarding complete!", user: { id: updatedUser._id, name: updatedUser.name } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { message: "An error occurred during onboarding" },
      { status: 500 }
    );
  }
}
