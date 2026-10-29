import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/orders/cleanup
 * Auto-cancels unpaid orders older than 24 hours.
 * Can be called via Vercel Cron or external cron service.
 */
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Find and cancel unpaid orders older than 24h
    const { data: expiredOrders, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'expired',
      })
      .eq('payment_status', 'unpaid')
      .eq('status', 'pending_payment')
      .lt('created_at', oneDayAgo)
      .select('id, order_number');

    if (error) {
      console.error('[Cleanup] Error cancelling orders:', error);
      return NextResponse.json({ error: 'Failed to cleanup orders' }, { status: 500 });
    }

    const count = expiredOrders?.length || 0;
    console.log(`[Cleanup] Cancelled ${count} expired orders`);

    return NextResponse.json({
      success: true,
      cancelled: count,
      orders: expiredOrders?.map(o => o.order_number) || [],
    });
  } catch (err: any) {
    console.error('[Cleanup] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
