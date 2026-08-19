import characterWeight from '../assets/brand/character-weight.svg'
import characterLine from '../assets/brand/character-line.svg'
import characterHealth from '../assets/brand/character-health.svg'
import characterSkin from '../assets/brand/character-skin.svg'

import profileWeight from '../assets/brand/profile-weight.svg'
import profileLine from '../assets/brand/profile-line.svg'
import profileHealth from '../assets/brand/profile-health.svg'
import profileSkin from '../assets/brand/profile-skin.svg'

export type GoalId =
  | 'weight'
  | 'line'
  | 'health'
  | 'skin'

const VALID_GOALS: GoalId[] = [
  'weight',
  'line',
  'health',
  'skin',
]

export function pickGoalVariant(
  goals: string[] | null | undefined,
): GoalId {
  if (!goals || goals.length === 0) {
    return 'weight'
  }

  // 온보딩은 선택한 목표를 배열 뒤에 추가하므로
  // 가장 최근에 선택한 목표를 대표 캐릭터로 사용
  for (
    let index = goals.length - 1;
    index >= 0;
    index -= 1
  ) {
    const goal =
      goals[index] as GoalId

    if (
      VALID_GOALS.includes(
        goal,
      )
    ) {
      return goal
    }
  }

  return 'weight'
}

export const CHARACTER_BY_GOAL:
  Record<GoalId, string> = {
    weight: characterWeight,
    line: characterLine,
    health: characterHealth,
    skin: characterSkin,
  }

export const PROFILE_BY_GOAL:
  Record<GoalId, string> = {
    weight: profileWeight,
    line: profileLine,
    health: profileHealth,
    skin: profileSkin,
  }