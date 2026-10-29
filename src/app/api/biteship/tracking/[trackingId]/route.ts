import { NextRequest, NextResponse } from 'next/server';
import { biteship } from '@/lib/biteship';

/**
 * Get Biteship Tracking Details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;
    const data = await biteship.getTracking(trackingId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Biteship API] Get Tracking Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data pelacakan dari Biteship' },
      { status: 500 }
    );
  }
}
