import { createBrowserClient } from "@supabase/ssr";

// Fallback values prevent build-time crashes during static prerendering.
// Real values are required at runtime and must be set in Vercel env vars.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
