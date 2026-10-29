import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Database-free implementation - redirect to WhatsApp for order tracking
  return NextResponse.json({
    success: false,
    message: 'Order tracking dilakukan melalui WhatsApp. Hubungi 081260001487',
    whatsappUrl: 'https://wa.me/6281260001487?text=Halo, saya ingin menanyakan status pesanan.'
  }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // Database-free implementation - redirect to WhatsApp for order management
  return NextResponse.json({
    success: false,
    message: 'Update status pesanan dilakukan melalui WhatsApp. Hubungi 081260001487',
    whatsappUrl: 'https://wa.me/6281260001487?text=Halo, saya ingin mengupdate status pesanan.'
  }, { status: 200 });
}