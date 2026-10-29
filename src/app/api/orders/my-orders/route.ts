import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';
import { syncOrderWithBiteship } from '@/lib/biteship-sync';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusTab = searchParams.get('tab') || 'all';

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`user_id.eq.${session.user.id},guest_email.eq.${session.user.email}`)
      .order('created_at', { ascending: false });

    // Filter by tab status
    // Menunggu Proses: pending_payment, paid, processing
    // Dikirim: shipped
    // Selesai: completed
    // Dibatalkan: cancelled, expired
    if (statusTab === 'processing') {
      query = query.in('status', ['pending_payment', 'paid', 'processing']);
    } else if (statusTab === 'shipped') {
      query = query.eq('status', 'shipped');
    } else if (statusTab === 'completed') {
      query = query.eq('status', 'completed');
    } else if (statusTab === 'cancelled') {
      query = query.in('status', ['cancelled', 'expired']);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Sync active orders before returning
    const syncedData = await Promise.all(
      (data || []).map(order => syncOrderWithBiteship(order, supabase))
    );

    return NextResponse.json({ success: true, data: syncedData });
  } catch (error: any) {
    console.error('[My Orders] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
