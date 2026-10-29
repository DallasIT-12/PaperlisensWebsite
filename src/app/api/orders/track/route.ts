import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncOrderWithBiteship } from '@/lib/biteship-sync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query) {
      return NextResponse.json({ error: 'Order number or phone is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Search by order number (exact) or phone (exact)
    // We search shipping_address JSON for phone or guest_phone column
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`order_number.eq.${query},guest_phone.eq.${query}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!orders || orders.length === 0) {
      // Try searching inside the JSON shipping_address for phone
      const { data: ordersByAddr, error: err2 } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .filter('shipping_address->>phone', 'eq', query)
        .order('created_at', { ascending: false });
      
      if (err2) throw err2;
      
      if (!ordersByAddr || ordersByAddr.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      // Sync active orders before returning
      const syncedOrdersByAddr = await Promise.all(
        ordersByAddr.map(order => syncOrderWithBiteship(order, supabase))
      );
      
      return NextResponse.json({ success: true, data: syncedOrdersByAddr });
    }

    // Sync active orders before returning
    const syncedOrders = await Promise.all(
      orders.map(order => syncOrderWithBiteship(order, supabase))
    );

    return NextResponse.json({ success: true, data: syncedOrders });
  } catch (error: any) {
    console.error('[Track Order] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
