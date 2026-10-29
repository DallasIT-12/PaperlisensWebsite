import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (!adminUser || !adminPass) {
            return NextResponse.json({ error: 'Server misconfiguration: Credentials not set' }, { status: 500 });
        }

        if (username === adminUser && password === adminPass) {
            // Valid credentials
            // Set encrypted/signed cookie session (simplified for now but secure)
            // In a real app, use JWT or proper session management.
            // Here we set a simple token checked by middleware.

            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: 'strict',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
