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

// ==============================
// 일일 기록 조회 캐시
//
// 같은 날짜 데이터를 여러 컴포넌트에서
// 동시에 요청하더라도 실제 서버 요청은
// 한 번만 보내도록 한다.
// ==============================

type DiaryCacheEntry = {
  data: DailyDiaryResponse
  createdAt: number
}

const diaryCache =
  new Map<string, DiaryCacheEntry>()

const pendingDiaryRequests =
  new Map<
    string,
    Promise<DailyDiaryResponse>
  >()

// 같은 날짜 데이터는 30초 동안 재사용
const CACHE_TTL = 30_000

// ==============================
// 일일 기록 조회
// ==============================

export async function getDailyDiary(
  date?: string,
): Promise<DailyDiaryResponse> {
  const key =
    date ?? '__today__'

  // ------------------------------
  // 1. 최근 조회한 데이터가 있으면
  // 서버 요청 없이 캐시 사용
  // ------------------------------

  const cached =
    diaryCache.get(key)

  if (
    cached &&
    Date.now() -
      cached.createdAt <
      CACHE_TTL
  ) {
    return cached.data
  }

  // ------------------------------
  // 2. 같은 날짜 요청이 이미 진행 중이면
  // 새 요청을 만들지 않고 기존 Promise 사용
  // ------------------------------

  const pending =
    pendingDiaryRequests.get(
      key,
    )

  if (pending) {
    return pending
  }

  // ------------------------------
  // 3. 실제 서버 요청
  // ------------------------------

  const query =
    date
      ? `?date=${encodeURIComponent(
          date,
        )}`
      : ''

  const request =
    apiFetch<DailyDiaryResponse>(
      `/api/v1/diary/daily${query}`,
    )
      .then((data) => {
        diaryCache.set(
          key,
          {
            data,
            createdAt:
              Date.now(),
          },
        )

        return data
      })
      .finally(() => {
        pendingDiaryRequests.delete(
          key,
        )
      })

  pendingDiaryRequests.set(
    key,
    request,
  )

  return request
}

// ==============================
// 일일 기록 저장
// ==============================

export async function saveDailyDiary(
  data: DailyDiaryPatchRequest,
): Promise<DailyDiaryResponse> {
  const saved =
    await apiFetch<DailyDiaryResponse>(
      '/api/v1/diary/daily',
      {
        method: 'PATCH',
        body: JSON.stringify(
          data,
        ),
      },
    )

  // ------------------------------
  // 저장 성공 후 해당 날짜 캐시도
  // 서버에서 받은 최신 데이터로 갱신
  // ------------------------------

  diaryCache.set(
    data.date,
    {
      data: saved,
      createdAt:
        Date.now(),
    },
  )

  // 날짜 없이 조회한 오늘 데이터가
  // 이전 값일 수 있으므로 제거
  diaryCache.delete(
    '__today__',
  )

  return saved
}