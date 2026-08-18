export const API_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:5173'


export type GoalData = {
  dailyCalorieGoal: number | null
}


const STORAGE_KEY =
  'bloom.goal'


function readGoal(): GoalData {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY,
      )

    if (!saved) {
      return {
        dailyCalorieGoal:
          null,
      }
    }

    const parsed =
      JSON.parse(saved)

    return {
      dailyCalorieGoal:
        Number(
          parsed.dailyCalorieGoal,
        ) || null,
    }
  } catch {
    return {
      dailyCalorieGoal:
        null,
    }
  }
}


export async function getGoal():
  Promise<GoalData> {
  return readGoal()
}


export async function saveGoal(
  goal: GoalData,
): Promise<GoalData> {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(goal),
  )

  return goal
}