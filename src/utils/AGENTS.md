# Utils - AI Agent 지침서

## 모듈 역할

순수 유틸리티 함수 및 헬퍼 집합. 비즈니스 로직과 독립적인 재사용 가능한 기능을 제공한다.

## 의존성 관계

- `@/types/memo` — Memo 타입

## 유틸리티 목록

| 파일 | 역할 |
|------|------|
| `supabaseClient.ts` | Supabase 클라이언트 팩토리 (서버 액션 전용) |
| `memoFormat.ts` | 순수 포맷 함수 (`formatDate`, `stripMarkdown`, `getCategoryColor`) |

## supabaseClient.ts 구조

```typescript
// SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY 환경변수로 클라이언트 생성 (세션 미유지)
const createSupabaseClient: () => SupabaseClient
```

- DB 테이블: `memos` (id uuid, title, content, category, tags text[], created_at, updated_at)
- 컬럼은 snake_case, `Memo` 인터페이스는 camelCase — 변환은 `src/app/actions/memoActions.ts`의 `toMemo`에서 수행

## Implementation Patterns

### 새 유틸리티 파일 작성 템플릿

```typescript
// 타입 import
import { SomeType } from '@/types/someType'

// 상수 정의
const SOME_CONSTANT = 'value'

// 객체 형태로 관련 함수 그룹화
export const utilName = {
  method1: (param: ParamType): ReturnType => {
    // 구현
  },

  method2: (param: ParamType): ReturnType => {
    // 구현
  },
}
```

## Local Golden Rules

### Do's

- 모든 유틸리티는 순수 함수로 작성 (사이드 이펙트 최소화)
- 브라우저 전용 API를 쓰는 경우에만 함수 최상단에서 SSR 환경 체크
- 에러 발생 시 적절한 기본값 반환
- JSON 파싱/직렬화 시 try-catch 필수

### Don'ts

- React 훅 사용 금지 (유틸리티는 훅이 아님)
- 전역 상태 변경 금지
- 직접 DOM 조작 금지 (React에 위임)
- 비동기 함수에서 에러 무시 금지

## 테스트 고려사항

유틸리티 함수는 단위 테스트하기 용이함:
- 순수 함수는 입력 -> 출력 테스트
- Supabase 의존 함수는 모킹 필요
