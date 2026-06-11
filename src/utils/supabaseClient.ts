/**
 * Supabase 클라이언트 준비 파일 (Phase 3 연동 예정)
 *
 * [사용 방법]
 * 1. Supabase 프로젝트 생성 (https://supabase.com)
 * 2. .env.local에 아래 변수 설정:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 3. npm install @supabase/supabase-js
 * 4. 이 파일의 주석을 해제하여 활성화
 *
 * [DB 테이블 스키마 (Supabase SQL Editor에서 실행)]
 *
 * create table public.diagnosis_records (
 *   id          uuid default gen_random_uuid() primary key,
 *   created_at  timestamp with time zone default now(),
 *   survey_id   text not null,
 *   survey_title text not null,
 *   persona_name text not null,
 *   emoji       text,
 *   user_name   text,
 *   region      text,
 *   position    text,
 *   generation  text,
 *   avg_score   numeric,
 *   category_scores jsonb
 * );
 *
 * -- RLS: 공개 쓰기 허용 (익명 사용자도 저장 가능)
 * alter table public.diagnosis_records enable row level security;
 * create policy "Anyone can insert" on public.diagnosis_records for insert with check (true);
 * create policy "Admin can read" on public.diagnosis_records for select using (auth.role() = 'authenticated');
 */

// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
//
// export const pushRecordToSupabase = async (record: {
//   survey_id: string;
//   survey_title: string;
//   persona_name: string;
//   emoji: string;
//   user_name?: string;
//   region?: string;
//   position?: string;
//   generation?: string;
//   avg_score?: number;
//   category_scores?: Record<string, number>;
// }) => {
//   const { error } = await supabase.from('diagnosis_records').insert([record]);
//   if (error) {
//     console.error('[Supabase] Failed to push record:', error.message);
//   }
// };

// Phase 2까지는 localStorage 전용 mock 함수
export const pushRecordToSupabase = async (_record: unknown): Promise<void> => {
  // Supabase 미연동 상태 — Phase 3에서 위의 주석 해제 후 교체
  console.info('[Supabase] Phase 3 대기 중. 현재는 localStorage에만 저장됩니다.');
};
