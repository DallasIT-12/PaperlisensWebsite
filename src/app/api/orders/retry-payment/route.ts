import { NextRequest, NextResponse } from 'next/server';
import { createSnapTransaction } from '@/lib/midtrans';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (findError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
    }

    if (order.payment_method === 'cod') {
      return NextResponse.json({ error: 'COD orders do not need online payment' }, { status: 400 });
    }

    // Map items for Midtrans
    const midtransItems = order.order_items.map((item: any) => ({
      id: item.product_id,
      name: item.product_name.substring(0, 50),
      price: item.price,
      quantity: item.quantity,
    }));

    if (order.shipping_cost > 0) {
      midtransItems.push({
        id: 'SHIPPING',
        name: `Shipping Fee`.substring(0, 50),
        price: order.shipping_cost,
        quantity: 1,
      });
    }

    const addr = order.shipping_address as any;
    
    // Use a unique order ID for Midtrans by adding a timestamp suffix 
    // to avoid "order_id already used" error
    const retryOrderId = `${order.midtrans_order_id}-R${Math.floor(Date.now() / 1000)}`;

    const snapResult = await createSnapTransaction({
      orderId: retryOrderId,
      grossAmount: order.total,
      items: midtransItems,
      customer: {
        first_name: addr.name || order.guest_name,
        email: order.guest_email || `${addr.phone}@guest.paperlisens.com`,
        phone: addr.phone || order.guest_phone,
        shipping_address: {
          first_name: addr.name || order.guest_name,
          address: addr.address,
          city: addr.city,
          postal_code: addr.postal_code || '',
          phone: addr.phone || order.guest_phone,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        snapToken: snapResult.token,
        orderNumber: order.order_number,
      },
    });
  } catch (error: any) {
    console.error('[Retry Payment] POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
