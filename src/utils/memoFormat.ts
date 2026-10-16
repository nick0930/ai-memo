export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 카드 미리보기용: 마크다운 기호를 제거한 일반 텍스트로 변환
export const stripMarkdown = (text: string) =>
  text
    .replace(/^\s*```.*$/gm, '')
    .replace(/^\s*\|?[\s:|-]*-{3,}[\s:|-]*\|?\s*$/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*([-*+]|\d+\.)\s+/gm, '')
    .replace(/(\*\*|__|~~|\*|`)/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const getCategoryColor = (category: string) => {
  const colors = {
    personal: 'bg-blue-100 text-blue-800',
    work: 'bg-green-100 text-green-800',
    study: 'bg-purple-100 text-purple-800',
    idea: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800',
  }
  return colors[category as keyof typeof colors] || colors.other
}
