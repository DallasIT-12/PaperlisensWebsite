import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash,
        phone: phone || null,
        image: null,
        emailVerified: null,
      })
      .select('id, name, email')
      .single();

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Gagal mendaftar. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
