import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verifikasi agar hanya Vercel Cron yang bisa mengakses endpoint ini
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Lakukan query super ringan untuk mereset timer inactivity Supabase (7 hari)
    const count = await prisma.user.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Keep-alive ping successful', 
      usersCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Keep-alive ping failed:', error);
    return NextResponse.json({ success: false, error: 'Database ping failed' }, { status: 500 });
  }
}
