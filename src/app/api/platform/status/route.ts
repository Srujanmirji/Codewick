import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PlatformSettings from '@/models/PlatformSettings';

// This is a lightweight, unauthenticated route used internally by the middleware
// to check if maintenance mode is active. It is cached for 30 seconds.
export async function GET() {
  try {
    await connectDB();
    const settings = await PlatformSettings.findOne({});
    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false,
      disableSignups: settings?.disableSignups ?? false,
    });
  } catch {
    // If DB is down, don't block the whole site — default to "no maintenance"
    return NextResponse.json({ maintenanceMode: false, disableSignups: false });
  }
}
