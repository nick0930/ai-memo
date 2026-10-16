'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Memo } from '@/types/memo'
import { summarizeMemoAction } from '@/app/actions/summaryActions'

const DEFAULT_ERROR = '요약 중 오류가 발생했습니다.'

export function useMemoSummary(memoId: string | undefined) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 서버 액션은 취소할 수 없으므로, 요청 번호로 오래된 응답을 무시한다.
  const requestIdRef = useRef(0)

  const reset = useCallback(() => {
    requestIdRef.current += 1
    setSummary(null)
    setError(null)
    setLoading(false)
  }, [])

  // 메모가 바뀌거나 모달이 닫히면 진행 중인 요청 결과를 버리고 상태를 초기화
  useEffect(() => {
    reset()
    return () => {
      requestIdRef.current += 1
    }
  }, [memoId, reset])

  const requestSummary = useCallback(async (memo: Memo) => {
    const requestId = ++requestIdRef.current

    setLoading(true)
    setError(null)
    setSummary(null)

    try {
      const result = await summarizeMemoAction(memo.id)
      if (requestId !== requestIdRef.current) return
      if ('error' in result) {
        setError(result.error)
      } else {
        setSummary(result.summary)
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      console.error('Failed to summarize memo:', err)
      setError(DEFAULT_ERROR)
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }, [])

  return { summary, loading, error, requestSummary, reset }
}
