'use server'

import { v4 as uuidv4 } from 'uuid'
import { Memo, MemoFormData } from '@/types/memo'
import { createSupabaseClient } from '@/utils/supabaseClient'

const TABLE = 'memos'

// DB 컬럼(snake_case)과 Memo 인터페이스(camelCase)를 매핑하기 위한 행 타입
interface MemoRow {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

const toMemo = (row: MemoRow): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

// 메모 목록 조회 (최신순)
export async function getMemosAction(): Promise<Memo[]> {
  const { data, error } = await createSupabaseClient()
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .returns<MemoRow[]>()

  if (error) {
    console.error('Failed to load memos:', error.message)
    throw new Error('메모를 불러오지 못했습니다.')
  }
  return data.map(toMemo)
}

// 메모 생성
export async function createMemoAction(formData: MemoFormData): Promise<Memo> {
  const { data, error } = await createSupabaseClient()
    .from(TABLE)
    .insert({
      id: uuidv4(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
    })
    .select()
    .single<MemoRow>()

  if (error) {
    console.error('Failed to create memo:', error.message)
    throw new Error('메모를 저장하지 못했습니다.')
  }
  return toMemo(data)
}

// 메모 수정
export async function updateMemoAction(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  const { data, error } = await createSupabaseClient()
    .from(TABLE)
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single<MemoRow>()

  if (error) {
    console.error('Failed to update memo:', error.message)
    throw new Error('메모를 수정하지 못했습니다.')
  }
  return toMemo(data)
}

// 메모 삭제
export async function deleteMemoAction(id: string): Promise<void> {
  const { error } = await createSupabaseClient().from(TABLE).delete().eq('id', id)

  if (error) {
    console.error('Failed to delete memo:', error.message)
    throw new Error('메모를 삭제하지 못했습니다.')
  }
}

// 모든 메모 삭제
export async function clearMemosAction(): Promise<void> {
  // supabase-js 는 조건 없는 delete 를 막으므로 항상 참인 조건을 준다.
  const { error } = await createSupabaseClient()
    .from(TABLE)
    .delete()
    .not('id', 'is', null)

  if (error) {
    console.error('Failed to clear memos:', error.message)
    throw new Error('메모를 모두 삭제하지 못했습니다.')
  }
}
