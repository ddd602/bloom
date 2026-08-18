import { apiFetch } from './ApiClient'

export type EmotionTag =
  | 'HAPPY'
  | 'JOY'
  | 'EXCITED'
  | 'ENERGETIC'
  | 'CALM'
  | 'COMFORTABLE'
  | 'BORED'
  | 'ANXIOUS'
  | 'UNPLEASANT'
  | 'UNCOMFORTABLE'
  | 'SELF_BLAME'
  | 'SAD'
  | 'IRRITATED'
  | 'ANGRY'
  | 'SENSITIVE'
  | 'STRESS'

export type BodyConditionTag =
  | 'MENSTRUATING'
  | 'FERTILE_WINDOW'
  | 'OVULATION'
  | 'FATIGUED'
  | 'SWELLING'
  | 'LOWER_BACK_PAIN'
  | 'PELVIC_PAIN'
  | 'MUSCLE_PAIN'
  | 'LOW_APPETITE'
  | 'NORMAL_APPETITE'
  | 'INCREASED_APPETITE'

export type SkinTag =
  | 'ACNE'
  | 'MELASMA'
  | 'HYPERPIGMENTATION'
  | 'DRYNESS'
  | 'SENSITIVITY'
  | 'REDNESS'
  | 'ITCHING'
  | 'STRETCH_MARKS'
  | 'LOSS_OF_ELASTICITY'
  | 'SCARRING'
  | 'OILINESS'
  | 'ENLARGED_PORES'

export type MealType =
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'SNACK'

export type DiaryMealResponse = {
  mealId: number
  mealType: MealType
  foodName: string
  kcal: number | null
  carbs: number | null
  protein: number | null
  fat: number | null
}

export type ActivityResponse = {
  activityId: number
  steps: number
  exerciseMinutes: number
  burnedKcal: number
  memo: string | null
}

export type DailyDiaryPatchRequest = {
  date: string

  weightKg?: number | null

  emotionScore?: number | null
  bodyScore?: number | null

  emotionTags?: EmotionTag[] | null
  bodyTags?: BodyConditionTag[] | null

  waterMl?: number | null

  skin?: SkinTag[] | null

  memo?: string | null
}

export type DailyDiaryResponse = {
  date: string

  weightKg: number | null

  emotionScore: number | null
  bodyScore: number | null

  emotionTags: EmotionTag[]
  bodyTags: BodyConditionTag[]

  waterMl: number | null

  skin: SkinTag[]

  // 백엔드 응답에는 존재하지만
  // 현재 프론트에서는 저장하지 않음
  periodStart: string | null
  periodEnd: string | null

  memo: string | null

  totalCalories: number
  calorieChange: number | null
  recommendedCalories: number
  remainingCalories: number
  nutritionIncomplete: boolean

  totalSteps: number
  stepsChange: number | null

  totalExerciseMinutes: number
  exerciseMinutesChange: number | null

  totalBurnedKcal: number
  burnedKcalChange: number | null

  meals: DiaryMealResponse[]

  activities: ActivityResponse[]
}

export async function getDailyDiary(
  date?: string,
): Promise<DailyDiaryResponse> {
  const query =
    date
      ? `?date=${encodeURIComponent(date)}`
      : ''

  return apiFetch<DailyDiaryResponse>(
    `/api/v1/diary/daily${query}`,
  )
}

export async function saveDailyDiary(
  data: DailyDiaryPatchRequest,
): Promise<DailyDiaryResponse> {
  return apiFetch<DailyDiaryResponse>(
    '/api/v1/diary/daily',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}