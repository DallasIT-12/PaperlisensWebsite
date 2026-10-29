import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client (uses anon key - for API routes)
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export type PaperlisensProduct = {
  id: string;
  product_slug: string;
  name: string;
  name_en: string | null;
  name_zh: string | null;
  variant: string | null;
  variant_en: string | null;
  variant_zh: string | null;
  description: string | null;
  description_en: string | null;
  description_zh: string | null;
  category: string;
  price: number;
  image: string;
  images: string[];
  sold: number;
  slug: string;
  created_at?: string;
  updated_at?: string;
};
