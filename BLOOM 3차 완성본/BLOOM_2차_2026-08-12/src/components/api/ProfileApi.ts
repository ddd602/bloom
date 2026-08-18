import { apiFetch } from './ApiClient'

export type ProfileResponse = {
  userId: number
  email: string
  nickname: string

  birthDate: string | null
  deliveryDate: string | null

  heightCm: number | null
  weightKg: number | null

  beautyGoals: string[]
  healthIssues: string[]

  lastPeriodDate: string | null
  cycleLength: number | null

  onboardingCompleted: boolean
}

export type ProfilePatchRequest = {
  heightCm?: number
  weightKg?: number
  beautyGoals?: string[]
  healthIssues?: string[]
  lastPeriodDate?: string
  cycleLength?: number
}

export async function getProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(
    '/api/v1/users/me/profile',
  )
}

export async function updateProfile(
  data: ProfilePatchRequest,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(
    '/api/v1/users/me/profile',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}