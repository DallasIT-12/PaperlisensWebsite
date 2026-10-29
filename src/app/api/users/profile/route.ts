import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/users/profile
 * Returns the current logged-in user's profile (name, email, phone)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, image')
      .eq('id', session.user.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      image: user.image || '',
    });
  } catch (err) {
    console.error('[Profile API] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
