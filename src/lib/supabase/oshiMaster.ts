import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/oshiMaster';

// サーバー側でデータを取るための、シンプルなクライアント
export function createOshiMasterClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_OSHI_MASTER_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_OSHI_MASTER_SUPABASE_ANON_KEY!
  );
}
