import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Biteship Webhook Handler
 * Receives shipping status updates from Biteship.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, order_id, status, waybill_id, courier_tracking_id, history } = body;

    console.log(`[Biteship Webhook] Event: ${event}, OrderID: ${order_id}, Status: ${status}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find order by biteship_order_id
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('id, status, tracking_status')
      .eq('biteship_order_id', order_id)
      .single();

    if (findError || !order) {
      console.error('[Biteship Webhook] Order not found for ID:', order_id);
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const updateData: any = {
      tracking_status: status,
      updated_at: new Date().toISOString()
    };

    if (waybill_id) updateData.waybill_id = waybill_id;
    if (courier_tracking_id) updateData.biteship_tracking_id = courier_tracking_id;
    if (history) updateData.tracking_history = history;

    // Map Biteship status to our order status
    // Biteship statuses: confirmed, allocated, picking_up, picked, in_transit, dropping_off, delivered, cancelled, rejected, returned
    let newOrderStatus = order.status;
    
    switch (status) {
      case 'picked':
      case 'in_transit':
      case 'dropping_off':
        newOrderStatus = 'shipped';
        break;
      case 'delivered':
        newOrderStatus = 'completed';
        break;
      case 'cancelled':
      case 'rejected':
        newOrderStatus = 'cancelled';
        break;
      case 'returned':
        newOrderStatus = 'returned';
        break;
      case 'confirmed':
      case 'allocated':
      case 'picking_up':
        newOrderStatus = 'processing';
        break;
    }

    if (newOrderStatus !== order.status) {
      updateData.status = newOrderStatus;
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error('[Biteship Webhook] DB update error:', updateError);
      return NextResponse.json({ success: false, message: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OK' });
  } catch (error: any) {
    console.error('[Biteship Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
