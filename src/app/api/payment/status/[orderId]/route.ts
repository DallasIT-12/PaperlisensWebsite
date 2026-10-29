import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/midtrans';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order from database
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    // If order has midtrans_order_id, also check Midtrans for real-time status
    let midtransStatus = null;
    if (order.midtrans_order_id) {
      try {
        midtransStatus = await getTransactionStatus(order.midtrans_order_id);
      } catch {
        // Midtrans status check failed, use DB status
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        total: order.total,
        shippingAddress: order.shipping_address,
        shippingCourier: order.shipping_courier,
        shippingService: order.shipping_service,
        trackingNumber: order.tracking_number,
        items: order.order_items,
        createdAt: order.created_at,
        paidAt: order.paid_at,
        midtransStatus: midtransStatus?.transaction_status || null,
      },
    });
  } catch (error: any) {
    console.error('[Payment Status] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
