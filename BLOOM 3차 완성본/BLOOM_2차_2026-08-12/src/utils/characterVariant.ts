import characterWeight from '../assets/brand/character-weight.svg'
import characterLine from '../assets/brand/character-line.svg'
import characterHealth from '../assets/brand/character-health.svg'
import characterSkin from '../assets/brand/character-skin.svg'

import profileWeight from '../assets/brand/profile-weight.svg'
import profileLine from '../assets/brand/profile-line.svg'
import profileHealth from '../assets/brand/profile-health.svg'
import profileSkin from '../assets/brand/profile-skin.svg'

export type GoalId = 'weight' | 'line' | 'health' | 'skin'

// 온보딩 '목표' 선택은 중복 선택이 가능해서, 대표 캐릭터를 하나로
// 정하기 위해 온보딩에 노출되는 순서를 그대로 우선순위로 사용
const GOAL_PRIORITY: GoalId[] = [
  'weight',
  'line',
  'health',
  'skin',
]

export function pickGoalVariant(
  goals: string[] | null | undefined,
): GoalId {
  const match = GOAL_PRIORITY.find((goal) =>
    goals?.includes(goal),
  )

  return match ?? 'weight'
}

export const CHARACTER_BY_GOAL: Record<GoalId, string> = {
  weight: characterWeight,
  line: characterLine,
  health: characterHealth,
  skin: characterSkin,
}

export const PROFILE_BY_GOAL: Record<GoalId, string> = {
  weight: profileWeight,
  line: profileLine,
  health: profileHealth,
  skin: profileSkin,
}
