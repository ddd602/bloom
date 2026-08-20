// 서버 에러 응답(JSON)을 사용자에게 보여줄 수 있는
// 한 줄 메시지로 변환한다. 형식이 다르거나 JSON이 아니면
// 안전하게 일반 문구로 대체한다.
export function parseErrorMessage(
  rawBody: string,
  status: number,
): string {
  if (!rawBody) {
    return `요청을 처리하지 못했습니다. (${status})`
  }

  try {
    const parsed =
      JSON.parse(rawBody) as {
        fieldErrors?: {
          field?: string
          reason?: string
        }[]
        message?: string
      }

    if (
      parsed.fieldErrors?.length
    ) {
      return parsed.fieldErrors
        .map(
          (fieldError) =>
            fieldError.reason ??
            fieldError.field ??
            '입력값을 확인해주세요.',
        )
        .join('\n')
    }

    if (parsed.message) {
      return parsed.message
    }
  } catch {
    // JSON이 아닌 응답(HTML 에러 페이지 등)은 그대로 아래로 진행
  }

  return `요청을 처리하지 못했습니다. (${status})`
}
