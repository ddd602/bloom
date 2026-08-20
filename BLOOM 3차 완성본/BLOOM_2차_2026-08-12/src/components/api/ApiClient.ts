import {
  API_URL,
  getAccessToken,
  reissueTokens,
  clearTokens,
} from './AuthApi'

type ApiOptions = RequestInit & {
  auth?: boolean
}

let dataMutationVersion = 0

export function getDataMutationVersion() {
  return dataMutationVersion
}

export function markDataMutation() {
  dataMutationVersion += 1
}

function isMutationMethod(
  method?: string,
) {
  const normalized =
    (method ?? 'GET')
      .toUpperCase()

  return (
    normalized === 'POST' ||
    normalized === 'PUT' ||
    normalized === 'PATCH' ||
    normalized === 'DELETE'
  )
}

async function createHeaders(
  headers?: HeadersInit,
  auth = true,
) {
  const requestHeaders =
    new Headers(headers)

  if (auth) {
    const accessToken =
      getAccessToken()

    if (accessToken) {
      requestHeaders.set(
        'Authorization',
        `Bearer ${accessToken}`,
      )
    }
  }

  return requestHeaders
}

async function request<T>(
  path: string,
  options: ApiOptions,
  retry: boolean,
): Promise<T> {
  const {
    auth = true,
    headers,
    ...rest
  } = options

  const requestHeaders =
    await createHeaders(
      headers,
      auth,
    )

  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !requestHeaders.has(
      'Content-Type',
    )
  ) {
    requestHeaders.set(
      'Content-Type',
      'application/json',
    )
  }

  let response = await fetch(
    `${API_URL}${path}`,
    {
      ...rest,
      headers: requestHeaders,
    },
  )

  // Access Token 만료
  if (
    response.status === 401 &&
    auth &&
    retry
  ) {
    try {
      await reissueTokens()
    } catch (error) {
      clearTokens()
      throw error
    }

    const retryHeaders =
      await createHeaders(
        headers,
        true,
      )

    if (
      rest.body &&
      !(rest.body instanceof FormData) &&
      !retryHeaders.has(
        'Content-Type',
      )
    ) {
      retryHeaders.set(
        'Content-Type',
        'application/json',
      )
    }

    response = await fetch(
      `${API_URL}${path}`,
      {
        ...rest,
        headers: retryHeaders,
      },
    )
  }

  if (!response.ok) {
    const message =
      await response.text()

    throw new Error(
      message ||
        `API 요청 실패 (${response.status})`,
    )
  }

  // 서버 데이터가 실제로 변경된 요청만
  // 전역 데이터 버전을 올린다.
  // WeeklyCalendar의 주간 리포트 캐시는
  // 이 값이 바뀌면 자동으로 무효화된다.
  if (
    isMutationMethod(
      rest.method,
    )
  ) {
    markDataMutation()
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  return request<T>(
    path,
    options,
    true,
  )
}