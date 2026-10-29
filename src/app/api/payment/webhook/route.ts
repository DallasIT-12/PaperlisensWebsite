import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, mapTransactionStatus } from '@/lib/midtrans';
import { createClient } from '@supabase/supabase-js';
import { biteship } from '@/lib/biteship';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Midtrans Webhook/Notification Handler
 * Midtrans will POST to this endpoint when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
      payment_type,
      transaction_id,
    } = body;

    console.log(`[Midtrans Webhook] Order: ${order_id}, Status: ${transaction_status}, Payment: ${payment_type}`);

    // Verify signature
    const expectedSignature = verifySignature(order_id, status_code, gross_amount);
    if (signature_key !== expectedSignature) {
      console.error('[Midtrans Webhook] Invalid signature!');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Map Midtrans status to our status
    const { orderStatus, paymentStatus } = mapTransactionStatus(transaction_status, fraud_status);

    // Update order in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const updateData: any = {
      status: orderStatus,
      payment_status: paymentStatus,
      payment_method: payment_type,
      midtrans_transaction_id: transaction_id,
      updated_at: new Date().toISOString(),
    };

    // Set paid_at timestamp when payment is confirmed
    if (orderStatus === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('midtrans_order_id', order_id);

    if (error) {
      console.error('[Midtrans Webhook] DB update error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`[Midtrans Webhook] Order ${order_id} updated: ${orderStatus} / ${paymentStatus}`);

    // Optional: Send WhatsApp notification to admin for successful payments
    if (orderStatus === 'paid') {
      // Fetch order details for notification and Biteship
      const { data: order } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('midtrans_order_id', order_id)
        .single();

      if (order) {
        const addr = order.shipping_address as any;
        console.log(`[Midtrans Webhook] 🎉 PAYMENT CONFIRMED!
  Order: ${order.order_number}
  Customer: ${addr?.name || order.guest_name || 'N/A'}
  Phone: ${addr?.phone || order.guest_phone || 'N/A'}
  Total: Rp ${order.total?.toLocaleString('id-ID')}
  Payment: ${payment_type}
  Items: ${order.order_items?.length || 0} produk`);
      }
    }

    return NextResponse.json({ success: true, message: 'OK' });
  } catch (error: any) {
    console.error('[Midtrans Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Midtrans also sends GET requests for health checks
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Midtrans webhook endpoint active' });
}
