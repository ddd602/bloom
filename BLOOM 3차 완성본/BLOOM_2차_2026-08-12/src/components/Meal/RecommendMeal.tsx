import {
  useEffect,
  useState,
} from 'react'

import {
  getMealRecommendation,
  type MealRecommendationResponse,
} from '../api/AiMealRecommendationApi'

import type {
  MealType,
} from '../api/MealApi'

type RecommendedMealProps = {
  date?: string
  mealType?: Extract<
    MealType,
    'BREAKFAST' | 'LUNCH' | 'DINNER'
  >
}

function getTodayDate() {
  const today = new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      today.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}

function getCurrentMealType():
  Extract<
    MealType,
    'BREAKFAST' | 'LUNCH' | 'DINNER'
  > {
  const hour =
    new Date().getHours()

  if (hour < 11) {
    return 'BREAKFAST'
  }

  if (hour < 16) {
    return 'LUNCH'
  }

  return 'DINNER'
}

export default function RecommendedMeal({
  date = getTodayDate(),
  mealType = getCurrentMealType(),
}: RecommendedMealProps) {
  const [
    recommendation,
    setRecommendation,
  ] =
    useState<
      MealRecommendationResponse | null
    >(null)

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState(false)

useEffect(() => {
  let cancelled = false

  const cacheKey =
    `mealRecommendation:${date}:${mealType}`

  const loadRecommendation =
    async () => {
      try {
        setLoading(true)
        setError(false)

        // 이전에 받은 추천이 있으면 그대로 사용
        const cached =
          localStorage.getItem(
            cacheKey,
          )

        if (cached) {
          const parsed =
            JSON.parse(
              cached,
            ) as MealRecommendationResponse

          if (!cancelled) {
            setRecommendation(
              parsed,
            )
            setLoading(false)
          }

          return
        }

        // 없을 때만 AI 추천 API 호출
        const result =
          await getMealRecommendation({
            date,
            mealType,
          })

        localStorage.setItem(
          cacheKey,
          JSON.stringify(
            result,
          ),
        )

        if (!cancelled) {
          setRecommendation(
            result,
          )
        }
      } catch (error) {
        console.error(
          '추천 식단을 불러오지 못했습니다.',
          error,
        )

        if (!cancelled) {
          setRecommendation(
            null,
          )
          setError(true)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

  void loadRecommendation()

  return () => {
    cancelled = true
  }
}, [
  date,
  mealType,
])

  return (
    <>
      <section className="mt-3 px-5">
        <h2 className="text-lg font-bold">
          추천 식단
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          아직 식사를 안했다면, 이런 식단은 어떨까요?
        </p>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {loading && (
            <article className="min-w-[110px] rounded-lg bg-gray-100 p-3">
              <p className="text-xs text-gray-500">
                추천 중
              </p>

              <p className="mt-3 text-sm font-medium leading-5 text-gray-400">
                식단을 불러오고 있어요
              </p>
            </article>
          )}

          {!loading &&
            recommendation && (
              <article className="min-w-[110px] rounded-lg bg-gray-100 p-3">
                <p className="text-xs text-gray-500">
                  최적
                </p>

                <p className="mt-1 text-lg font-bold">
                  {recommendation.totalKcal ===
                  null
                    ? '-'
                    : recommendation.totalKcal}{' '}
                  kcal
                </p>

                <p className="mt-3 text-sm font-medium leading-5">
                  {recommendation.title}
                </p>
              </article>
            )}

          {!loading &&
            error && (
              <p className="text-xs text-gray-400">
                추천 식단을 불러오지 못했어요.
              </p>
            )}
        </div>
      </section>
    </>
  )
}