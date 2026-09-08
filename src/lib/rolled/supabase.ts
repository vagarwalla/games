import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/*
 * Built lazily, not at module load. The Fly image runs `next build` with no
 * environment set, so a client constructed at import time would throw
 * "supabaseUrl is required" during the build rather than at the first request.
 * Deferring it also means a missing secret reports itself by name instead of
 * as a Supabase internal error.
 */
let client: SupabaseClient | null = null

export function supabaseClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Rolled needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Set them as Fly secrets on games-vaidehiagarwalla.'
    )
  }

  client = createClient(url, key)
  return client
}
