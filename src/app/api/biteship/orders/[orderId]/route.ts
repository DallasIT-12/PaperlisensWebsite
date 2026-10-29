import { NextRequest, NextResponse } from 'next/server';
import { biteship } from '@/lib/biteship';

/**
 * Get Biteship Order Details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const data = await biteship.getOrder(orderId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Biteship API] Get Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data pesanan dari Biteship' },
      { status: 500 }
    );
  }
}
