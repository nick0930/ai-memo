import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 서버 액션에서만 호출한다. 요청마다 가볍게 생성하며 세션은 유지하지 않는다.
export const createSupabaseClient = (): SupabaseClient => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL 또는 SUPABASE_PUBLISHABLE_KEY 환경변수가 설정되지 않았습니다.'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
