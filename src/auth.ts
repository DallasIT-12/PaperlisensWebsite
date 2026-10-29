import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// In local development, delete AUTH_URL to let NextAuth auto-detect localhost.
// This prevents CSRF token missing errors and redirects to the production site.
console.log(`[NextAuth] Init - NODE_ENV: ${process.env.NODE_ENV}, AUTH_URL in env: ${process.env.AUTH_URL}`);
if (process.env.NODE_ENV === 'development') {
  delete process.env.AUTH_URL;
  console.log(`[NextAuth] Deleted AUTH_URL for local development auto-detection.`);
}

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      checks: ['state'], // disable PKCE — fixes InvalidCheck pkceCodeVerifier error
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = getSupabase();
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email as string)
          .single();

        if (error || !user || !user.password_hash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-in, upsert user in our DB
      if (account?.provider === 'google' && user.email) {
        const supabase = getSupabase();
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!existing) {
          // Create new user from Google
          const { data: newUser } = await supabase
            .from('users')
            .insert({
              name: user.name,
              email: user.email,
              image: user.image,
              "emailVerified": new Date().toISOString(),
            })
            .select('id')
            .single();
          if (newUser) user.id = newUser.id;
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
});
