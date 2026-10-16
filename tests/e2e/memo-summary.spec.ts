import { test, expect, Page } from '@playwright/test'

// 요약은 API 라우트가 아니라 서버 액션(`Next-Action` 헤더가 붙은 POST /)으로 호출된다.
// 서버 액션 응답은 Flight 형식(text/x-component)이므로 같은 형식으로 모킹한다.
async function mockSummaryAction(
  page: Page,
  result: { summary: string } | { error: string },
  delayMs = 0
) {
  await page.route('**/', async route => {
    const request = route.request()
    if (request.method() !== 'POST' || !request.headers()['next-action']) {
      return route.continue()
    }
    if (delayMs) await new Promise(resolve => setTimeout(resolve, delayMs))
    await route.fulfill({
      status: 200,
      contentType: 'text/x-component',
      body: `0:{"a":"$@1","f":"","b":"mock"}\n1:${JSON.stringify(result)}\n`,
    })
  })
}

test.describe('메모 상세보기 AI 요약', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('memo-card').first().click()
    await expect(page.getByTestId('memo-viewer')).toBeVisible()
  })

  test('요약 버튼을 누르면 요약 결과가 표시된다', async ({ page }) => {
    await mockSummaryAction(page, { summary: '테스트 요약입니다.' })

    await page.getByTestId('memo-summary-btn').click()

    await expect(page.getByTestId('memo-summary-result')).toHaveText(
      '테스트 요약입니다.'
    )
  })

  test('요약 중에는 버튼이 비활성화된다', async ({ page }) => {
    await mockSummaryAction(page, { summary: '지연된 요약' }, 500)

    const button = page.getByTestId('memo-summary-btn')
    await button.click()

    await expect(button).toBeDisabled()
    await expect(button).toHaveText('요약 중...')
    await expect(page.getByTestId('memo-summary-result')).toBeVisible()
  })

  test('요약 실패 시 에러 메시지가 표시된다', async ({ page }) => {
    await mockSummaryAction(page, { error: '요약 중 오류가 발생했습니다.' })

    await page.getByTestId('memo-summary-btn').click()

    await expect(page.getByTestId('memo-summary-error')).toHaveText(
      '요약 중 오류가 발생했습니다.'
    )
  })
})
