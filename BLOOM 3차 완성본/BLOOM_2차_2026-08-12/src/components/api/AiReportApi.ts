import {
  getOnboarding,
  getProfile,
} from './OnboardingApi'

export type ReportItem = {
  heading: string
  body: string
}

export type AiReportData = {
  userName: string
  postpartumText: string

  healthInfo: {
    birthDate: string
    height: number
    weight: number
    goals: string[]
    focusAreas: string[]
    recoveryAreas: string[]
    conditions: string[]
    skinConcerns: string[]
  }

  priority: ReportItem[]
  method: ReportItem[]
}

function getPostpartumText(dueDate: string) {
  const birth = new Date(dueDate)
  const today = new Date()

  let years =
    today.getFullYear() -
    birth.getFullYear()

  const anniversaryPassed =
    today.getMonth() >
      birth.getMonth() ||
    (today.getMonth() ===
      birth.getMonth() &&
      today.getDate() >=
        birth.getDate())

  if (!anniversaryPassed) years--

  if (years <= 0) {
    const months =
      (today.getFullYear() -
        birth.getFullYear()) *
        12 +
      today.getMonth() -
      birth.getMonth()

    return `출산 ${Math.max(
      0,
      months,
    )}개월차`
  }

  return `출산 ${years}년차`
}

export async function getAiReport(): Promise<AiReportData> {
  const onboarding =
    await getOnboarding()

  const user =
    await getProfile()

  if (!onboarding) {
    throw new Error(
      '초기정보가 없습니다.',
    )
  }

  return {
    userName:
      user.nickname ?? '',

    postpartumText:
      getPostpartumText(
        onboarding.dueDate,
      ),

    healthInfo: {
      birthDate:
        onboarding.birthDate,

      height:
        onboarding.height,

      weight:
        onboarding.weight,

      goals:
        onboarding.goals,

      focusAreas:
        onboarding.focusAreas,

      recoveryAreas:
        onboarding.recoveryAreas,

      conditions:
        onboarding.conditions,

      skinConcerns:
        onboarding.skinConcerns,
    },

    priority: [
      {
        heading:
          '신체 목표 중심 관리',
        body:
          '입력한 신체 정보와 관리 목표를 기반으로 현재 우선적으로 관리할 영역을 분석했어요.',
      },
      {
        heading:
          '운동 및 회복 관리',
        body:
          '현재 몸 상태와 집중 관리 부위를 고려하여 무리하지 않고 꾸준히 관리하는 것이 중요해요.',
      },
      {
        heading:
          '생활 루틴 개선',
        body:
          '운동과 식단, 일상 기록을 함께 관리하면서 장기적인 변화를 확인하는 것을 추천해요.',
      },
    ],

    method: [
      {
        heading:
          '맞춤 운동 루틴',
        body:
          '집중 관리 부위와 현재 몸 상태를 바탕으로 적절한 운동을 선택해 꾸준히 진행해보세요.',
      },
      {
        heading:
          '균형 잡힌 식단 관리',
        body:
          '체중과 관리 목표를 고려하면서 식단을 기록하고 전체적인 섭취 균형을 관리해보세요.',
      },
      {
        heading:
          '주기적인 상태 기록',
        body:
          '몸 상태와 피부 고민 등의 변화를 꾸준히 기록하면 이후 분석에 더 많은 정보를 활용할 수 있어요.',
      },
    ],
  }
}