import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncOrderWithBiteship } from '@/lib/biteship-sync';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,guest_name.ilike.%${search}%,guest_phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data, total: count || 0, page, limit });
  } catch (error: any) {
    console.error('[Admin Orders] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber, action } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId wajib diisi' }, { status: 400 });
    }

    if (action === 'sync') {
      // Fetch full order details with order_items
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (findError || !order) {
        return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
      }

      // Sync status with Biteship
      const syncedOrder = await syncOrderWithBiteship(order, supabase);
      return NextResponse.json({ success: true, data: syncedOrder });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Admin Orders] PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
