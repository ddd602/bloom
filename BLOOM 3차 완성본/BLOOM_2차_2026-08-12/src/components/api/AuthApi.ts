export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const ACCESS_TOKEN_KEY = 'bloom.accessToken'
const REFRESH_TOKEN_KEY = 'bloom.refreshToken'
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'bloom.accessTokenExpiresAt'

export type SignupRequest = {
  email: string
  password: string
  nickname: string
}

export type SignupResponse = {
  userId: number
  email: string
  nickname: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

function saveTokens(tokens: TokenResponse) {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    tokens.accessToken,
  )

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken,
  )

  const expiresAt =
    Date.now() + tokens.expiresIn * 1000

  localStorage.setItem(
    ACCESS_TOKEN_EXPIRES_AT_KEY,
    String(expiresAt),
  )
}

export function getAccessToken() {
  return localStorage.getItem(
    ACCESS_TOKEN_KEY,
  )
}

export function getRefreshToken() {
  return localStorage.getItem(
    REFRESH_TOKEN_KEY,
  )
}

export function clearTokens() {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY,
  )

  localStorage.removeItem(
    REFRESH_TOKEN_KEY,
  )

  localStorage.removeItem(
    ACCESS_TOKEN_EXPIRES_AT_KEY,
  )
}

export async function signup(
  data: SignupRequest,
): Promise<SignupResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    const message = await response.text()

    throw new Error(
      message || '회원가입에 실패했습니다.',
    )
  }

  return response.json()
}

export async function login(
  data: LoginRequest,
): Promise<TokenResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    if (
      response.status === 400 ||
      response.status === 401
    ) {
      throw new Error(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      )
    }

    const message = await response.text()

    throw new Error(
      message || '로그인에 실패했습니다.',
    )
  }

  const tokens =
    (await response.json()) as TokenResponse

  saveTokens(tokens)

  return tokens
}
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()
  const accessToken = getAccessToken()

  // 저장된 토큰 자체가 없으면 로컬만 정리
  if (!refreshToken || !accessToken) {
    clearTokens()
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: 'LOGOUT',
          refreshToken,
        }),
      },
    )

    if (!response.ok) {
      const message = await response.text()

      throw new Error(
        message || '로그아웃에 실패했습니다.',
      )
    }
  } finally {
    // 서버 요청 성공 여부와 상관없이
    // 이 브라우저에서는 로그아웃 처리
    clearTokens()
  }
}
export async function reissueTokens(): Promise<TokenResponse> {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    clearTokens()
    throw new Error('로그인이 필요합니다.')
  }

  const response = await fetch(
    `${API_URL}/api/v1/auth/session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'REISSUE',
        refreshToken,
      }),
    },
  )

  if (!response.ok) {
    clearTokens()

    throw new Error(
      '로그인 세션이 만료되었습니다.',
    )
  }

  const tokens =
    (await response.json()) as TokenResponse

  saveTokens(tokens)

  return tokens
}