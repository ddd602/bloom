import {
  API_URL,
  getAccessToken,
  reissueTokens,
  clearTokens,
} from './AuthApi'

import { parseErrorMessage } from './apiError'

type ApiOptions = RequestInit & {
  auth?: boolean
}

const DATA_MUTATION_VERSION_KEY =
  'bloom.dataMutationVersion'

function readStoredMutationVersion() {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const stored =
      window.sessionStorage.getItem(
        DATA_MUTATION_VERSION_KEY,
      )

    const parsed = Number(stored)

    return Number.isFinite(parsed) &&
      parsed >= 0
      ? parsed
      : 0
  } catch {
    return 0
  }
}

function writeStoredMutationVersion(
  version: number,
) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(
      DATA_MUTATION_VERSION_KEY,
      String(version),
    )
  } catch {
    // sessionStorage 사용이 막혀 있어도
    // 메모리 버전만으로 기능은 계속 동작한다.
  }
}

let dataMutationVersion =
  readStoredMutationVersion()

export function getDataMutationVersion() {
  const storedVersion =
    readStoredMutationVersion()

  if (
    storedVersion >
    dataMutationVersion
  ) {
    dataMutationVersion =
      storedVersion
  }

  return dataMutationVersion
}

export function markDataMutation() {
  dataMutationVersion =
    getDataMutationVersion() + 1

  writeStoredMutationVersion(
    dataMutationVersion,
  )
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
    const rawBody =
      await response.text()

    throw new Error(
      parseErrorMessage(
        rawBody,
        response.status,
      ),
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