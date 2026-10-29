import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { biteship } from '@/lib/biteship';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Manual Biteship Order Creation
 * Allows admin to trigger shipment booking for an existing order.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID wajib diisi' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (findError || !order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.shipping_courier === 'local') {
      return NextResponse.json({ error: 'Pengiriman lokal tidak memerlukan Biteship' }, { status: 400 });
    }

    // Create Biteship shipment
    const shipment = await biteship.createShipment(order, order.order_items);

    if (!shipment) {
      return NextResponse.json({ error: 'Gagal membuat pengiriman di Biteship' }, { status: 500 });
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        biteship_order_id: shipment.id,
        biteship_tracking_id: shipment.tracking_id,
        waybill_id: shipment.waybill_id,
        tracking_status: shipment.status
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('[Biteship Admin] DB update error:', updateError);
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        biteship_order_id: shipment.id,
        waybill_id: shipment.waybill_id,
        status: shipment.status
      } 
    });
  } catch (error: any) {
    console.error('[Biteship Admin] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
