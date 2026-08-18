import { useEffect, useState } from "react"
import type { Meal } from "../types/Meal"
import RecommendedMeal from "./RecommendMeal"
import CalroriesDescription from "./CaloriesDescription"
import MealTimeline from "./MealTimeLine"
import {
  useLocation,
  useNavigate,
} from "react-router-dom"
import { IconChevronLeft } from "../icons"

import {
  getMealsByDate,
  mealCalories,
  MEAL_KEYS,
  MEAL_LABELS,
  type MealsData,
} from "../api/MealApi"

const EMPTY_MEALS: MealsData = {
  breakfast: { items: [] },
  lunch: { items: [] },
  dinner: { items: [] },
}

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    today.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export default function DailyMealDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const [data, setData] =
    useState<MealsData>(EMPTY_MEALS)

  const selectedDate =
    location.state?.selectedDate ??
    getTodayDate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const result =
          await getMealsByDate(
            selectedDate,
          )

        setData(result.meals)
      } catch (error) {
        console.error(
          "식사 기록을 불러오지 못했습니다.",
          error,
        )

        setData(EMPTY_MEALS)
      }
    }

    loadData()
  }, [selectedDate])

  const totalCalories =
    mealCalories(
      data.breakfast.items,
    ) +
    mealCalories(
      data.lunch.items,
    ) +
    mealCalories(
      data.dinner.items,
    )

  const meals: Meal[] =
    MEAL_KEYS.map(
      (key, idx) => {
        const rec =
          data[key]

        const recorded =
          rec.items.length > 0

        const cal =
          mealCalories(
            rec.items,
          )

        // 서버에서 받은 실제 탄수화물 합계
        const carbs =
          rec.items.reduce(
            (sum, item) =>
              sum +
              (item.carbs ?? 0),
            0,
          )

        // 서버에서 받은 실제 단백질 합계
        const protein =
          rec.items.reduce(
            (sum, item) =>
              sum +
              (item.protein ?? 0),
            0,
          )

        // 서버에서 받은 실제 지방 합계
        const fat =
          rec.items.reduce(
            (sum, item) =>
              sum +
              (item.fat ?? 0),
            0,
          )

        return {
          id: idx + 1,

          type:
            MEAL_LABELS[key],

          // 현재 서버 응답에는 식사 시간이 없음
          time: "--:--",

          menu: recorded
            ? rec.items
                .map(
                  (item) =>
                    item.name,
                )
                .join(", ")
            : "식사를 하지 않았어요",

          calories: recorded
            ? cal
            : null,

          carbs: recorded
            ? carbs
            : undefined,

          protein: recorded
            ? protein
            : undefined,

          fat: recorded
            ? fat
            : undefined,
        }
      },
    )

  const onSelect = (
    index: number,
  ) => {
    navigate(
      `/meal-input/${MEAL_KEYS[index]}`,
      {
        state: {
          selectedDate,
        },
      },
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <header
        className="px-6"
        style={{
          paddingTop:
            "calc(env(safe-area-inset-top) + 20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="flex h-[21px] items-center text-sm font-bold text-gray-900">
            일일 식단 세부 기록
          </h1>
        </div>
      </header>

      <section className="px-6 pt-7">
        <CalroriesDescription
          totalCalories={
            totalCalories
          }
        />
      </section>

      <MealTimeline
        meals={meals}
        onSelect={onSelect}
      />

      <RecommendedMeal />
    </main>
  )
}