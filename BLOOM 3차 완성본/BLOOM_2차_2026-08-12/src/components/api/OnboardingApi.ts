import { apiFetch } from './ApiClient'

export type OnboardingData = {
  birthDate: string
  dueDate: string
  height: number
  weight: number

  goals: string[]
  focusAreas: string[]
  recoveryAreas: string[]
  conditions: string[]
  skinConcerns: string[]
}

export type ProfileResponse = {
  userId: number
  email: string
  nickname: string
  birthDate: string
  deliveryDate: string
  heightCm: number
  weightKg: number

  beautyGoals: string[]
  focusAreas: string[]
  recoveryAreas: string[]
  healthIssues: string[]
  skinConcerns: string[]

  lastPeriodDate: string | null
  cycleLength: number | null
  onboardingCompleted: boolean
}

export async function saveOnboarding(
  data: OnboardingData,
): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(
    '/api/v1/onboarding',
    {
      method: 'POST',
      body: JSON.stringify({
        birthDate: data.birthDate,
        deliveryDate: data.dueDate,
        heightCm: data.height,
        weightKg: data.weight,

        beautyGoals: data.goals,
        focusAreas: data.focusAreas,
        recoveryAreas: data.recoveryAreas,
        healthIssues: data.conditions,
        skinConcerns: data.skinConcerns,

        lastPeriodDate: null,
        cycleLength: null,
      }),
    },
  )
}

export async function getProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(
    '/api/v1/users/me/profile',
  )
}

export async function getOnboarding(): Promise<OnboardingData> {
  const profile =
    await getProfile()

  return {
    birthDate:
      profile.birthDate,

    dueDate:
      profile.deliveryDate,

    height:
      profile.heightCm,

    weight:
      profile.weightKg,

    goals:
      profile.beautyGoals ?? [],

    focusAreas:
      profile.focusAreas ?? [],

    recoveryAreas:
      profile.recoveryAreas ?? [],

    conditions:
      profile.healthIssues ?? [],

    skinConcerns:
      profile.skinConcerns ?? [],
  }
}

export async function updateOnboarding(
  data: Partial<OnboardingData>,
): Promise<ProfileResponse> {
  const body: Record<string, unknown> = {}

  if (
    data.birthDate !==
    undefined
  ) {
    body.birthDate =
      data.birthDate
  }

  if (
    data.dueDate !==
    undefined
  ) {
    body.deliveryDate =
      data.dueDate
  }

  if (
    data.height !==
    undefined
  ) {
    body.heightCm =
      data.height
  }

  if (
    data.weight !==
    undefined
  ) {
    body.weightKg =
      data.weight
  }

  if (
    data.goals !==
    undefined
  ) {
    body.beautyGoals =
      data.goals
  }

  if (
    data.focusAreas !==
    undefined
  ) {
    body.focusAreas =
      data.focusAreas
  }

  if (
    data.recoveryAreas !==
    undefined
  ) {
    body.recoveryAreas =
      data.recoveryAreas
  }

  if (
    data.conditions !==
    undefined
  ) {
    body.healthIssues =
      data.conditions
  }

  if (
    data.skinConcerns !==
    undefined
  ) {
    body.skinConcerns =
      data.skinConcerns
  }

  return apiFetch<ProfileResponse>(
    '/api/v1/users/me/profile',
    {
      method: 'PATCH',
      body: JSON.stringify(
        body,
      ),
    },
  )
}