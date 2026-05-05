import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import PlatformSettings from "@/models/PlatformSettings";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await PlatformSettings.findOne({});
    
    // If no settings exist yet, create the default one
    if (!settings) {
      settings = await PlatformSettings.create({
        freezeEconomy: false,
        disableSignups: false,
        maintenanceMode: false,
      });
    }

    return NextResponse.json({
      freezeEconomy: settings.freezeEconomy,
      disableSignups: settings.disableSignups,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error: any) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    let settings = await PlatformSettings.findOne({});
    if (!settings) {
      settings = await PlatformSettings.create({
        freezeEconomy: false,
        disableSignups: false,
        maintenanceMode: false,
      });
    }

    if (body.freezeEconomy !== undefined) settings.freezeEconomy = body.freezeEconomy;
    if (body.disableSignups !== undefined) settings.disableSignups = body.disableSignups;
    if (body.maintenanceMode !== undefined) settings.maintenanceMode = body.maintenanceMode;
    
    settings.updatedBy = (session.user as any).id;
    settings.updatedAt = new Date();

    await settings.save();

    return NextResponse.json({
      freezeEconomy: settings.freezeEconomy,
      disableSignups: settings.disableSignups,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error: any) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
