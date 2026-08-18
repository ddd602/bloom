import { apiFetch } from './ApiClient'
import {
  getDailyDiary,
} from './DiaryApi'

export type MealKey =
  | 'breakfast'
  | 'lunch'
  | 'dinner'

export type MealType =
  | 'BREAKFAST'
  | 'LUNCH'
  | 'DINNER'
  | 'SNACK'

export type MealItem = {
  mealId?: number

  name: string

  kcal: number

  carbs?: number | null
  protein?: number | null
  fat?: number | null
}

export type MealRecord = {
  items: MealItem[]
}

export type MealsData = Record<
  MealKey,
  MealRecord
>

export type DailyMeals = {
  date: string
  meals: MealsData
}

export type MealResponse = {
  mealId: number

  mealType: MealType

  foodName: string

  kcal: number | null

  carbs: number | null
  protein: number | null
  fat: number | null
}

type MealRequest = {
  mealType: MealType

  foodName: string

  kcal: number | null

  carbs: number | null
  protein: number | null
  fat: number | null
}

export const MEAL_KEYS: MealKey[] = [
  'breakfast',
  'lunch',
  'dinner',
]

export const MEAL_LABELS: Record<
  MealKey,
  string
> = {
  breakfast: '아침식사',
  lunch: '점심식사',
  dinner: '저녁식사',
}

// ==============================
// 프론트 key → 서버 enum
// ==============================

const KEY_TO_TYPE: Record<
  MealKey,
  MealType
> = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
}

// ==============================
// 빈 식단 데이터
// ==============================

function createEmptyMeals(): MealsData {
  return {
    breakfast: {
      items: [],
    },

    lunch: {
      items: [],
    },

    dinner: {
      items: [],
    },
  }
}

// ==============================
// 서버 MealResponse
// → 프론트 MealItem
// ==============================

function toMealItem(
  meal: MealResponse,
): MealItem {
  return {
    mealId:
      meal.mealId,

    name:
      meal.foodName,

    kcal:
      meal.kcal ?? 0,

    carbs:
      meal.carbs,

    protein:
      meal.protein,

    fat:
      meal.fat,
  }
}

// ==============================
// 하루 식단 조회
//
// GET /api/v1/diary/daily
// 응답의 meals 사용
// ==============================

export async function getMealsByDate(
  date: string,
): Promise<DailyMeals> {
  const daily =
    await getDailyDiary(
      date,
    )

  const meals =
    createEmptyMeals()

  daily.meals.forEach(
    (meal) => {
      const serverMeal =
        meal as MealResponse

      const item =
        toMealItem(
          serverMeal,
        )

      if (
        serverMeal.mealType ===
        'BREAKFAST'
      ) {
        meals.breakfast.items.push(
          item,
        )
      }

      if (
        serverMeal.mealType ===
        'LUNCH'
      ) {
        meals.lunch.items.push(
          item,
        )
      }

      if (
        serverMeal.mealType ===
        'DINNER'
      ) {
        meals.dinner.items.push(
          item,
        )
      }
    },
  )

  return {
    date:
      daily.date,

    meals,
  }
}

// ==============================
// 여러 날짜 전체 조회
//
// 현재 백엔드에
// "모든 식단 전체 조회" 전용 API는 없음
// ==============================

export async function getMeals():
  Promise<DailyMeals[]> {
  return []
}

// ==============================
// 음식 하나 생성
//
// POST
// /api/v1/diaries/{date}/meals
// ==============================

async function createMeal(
  date: string,
  mealType: MealType,
  item: MealItem,
): Promise<MealResponse> {
  const request:
    MealRequest = {
    mealType,

    foodName:
      item.name.trim(),

    kcal:
      Number.isFinite(
        item.kcal,
      )
        ? item.kcal
        : null,

    carbs:
      item.carbs ?? null,

    protein:
      item.protein ?? null,

    fat:
      item.fat ?? null,
  }

  return apiFetch<MealResponse>(
    `/api/v1/diaries/${date}/meals`,
    {
      method: 'POST',

      body:
        JSON.stringify(
          request,
        ),
    },
  )
}

// ==============================
// 음식 하나 수정
//
// PATCH
// /api/v1/meals/{mealId}
// ==============================

export async function updateMeal(
  mealId: number,
  mealType: MealType,
  item: MealItem,
): Promise<MealResponse> {
  const request:
    MealRequest = {
    mealType,

    foodName:
      item.name.trim(),

    kcal:
      Number.isFinite(
        item.kcal,
      )
        ? item.kcal
        : null,

    carbs:
      item.carbs ?? null,

    protein:
      item.protein ?? null,

    fat:
      item.fat ?? null,
  }

  return apiFetch<MealResponse>(
    `/api/v1/meals/${mealId}`,
    {
      method: 'PATCH',

      body:
        JSON.stringify(
          request,
        ),
    },
  )
}

// ==============================
// 음식 하나 삭제
//
// DELETE
// /api/v1/meals/{mealId}
// ==============================

export async function deleteMealItem(
  mealId: number,
): Promise<void> {
  return apiFetch<void>(
    `/api/v1/meals/${mealId}`,
    {
      method: 'DELETE',
    },
  )
}

// ==============================
// 한 끼 저장
//
// 1. 기존 해당 끼니 음식 조회
// 2. 기존 음식 삭제
// 3. 현재 items 다시 생성
//
// 저장 버튼을 눌렀을 때만 실행
// ==============================

export async function saveMeal(
  date: string,
  key: MealKey,
  record: MealRecord,
): Promise<DailyMeals> {
  const mealType =
    KEY_TO_TYPE[key]

  let existing:
    DailyMeals

  try {
    existing =
      await getMealsByDate(
        date,
      )
  } catch {
    existing = {
      date,
      meals:
        createEmptyMeals(),
    }
  }

  // 기존 해당 끼니 음식
  const oldItems =
    existing.meals[
      key
    ].items

  // 기존 서버 데이터 삭제
  await Promise.all(
    oldItems
      .filter(
        (item) =>
          item.mealId !==
          undefined,
      )
      .map(
        (item) =>
          deleteMealItem(
            item.mealId!,
          ),
      ),
  )

  // 빈 음식 이름 제거
  const cleaned =
    record.items.filter(
      (item) =>
        item.name
          .trim()
          .length > 0,
    )

  // 현재 음식 다시 생성
  const created =
    await Promise.all(
      cleaned.map(
        (item) =>
          createMeal(
            date,
            mealType,
            item,
          ),
      ),
    )

  const result =
    createEmptyMeals()

  result.breakfast =
    existing.meals
      .breakfast

  result.lunch =
    existing.meals
      .lunch

  result.dinner =
    existing.meals
      .dinner

  result[key] = {
    items:
      created.map(
        toMealItem,
      ),
  }

  return {
    date,
    meals:
      result,
  }
}

// ==============================
// 특정 끼니 전체 삭제
// ==============================

export async function deleteMeal(
  date: string,
  key: MealKey,
): Promise<DailyMeals> {
  const existing =
    await getMealsByDate(
      date,
    )

  const targetItems =
    existing.meals[
      key
    ].items

  await Promise.all(
    targetItems
      .filter(
        (item) =>
          item.mealId !==
          undefined,
      )
      .map(
        (item) =>
          deleteMealItem(
            item.mealId!,
          ),
      ),
  )

  return getMealsByDate(
    date,
  )
}

// ==============================
// 칼로리 합계 계산
// ==============================

export function mealCalories(
  items: MealItem[],
) {
  return items.reduce(
    (
      sum,
      item,
    ) =>
      sum +
      (
        Number(
          item.kcal,
        ) || 0
      ),
    0,
  )
}

// ==============================
// 하루 총 섭취 칼로리
// ==============================

export function totalMealCalories(
  meals: MealsData,
) {
  return (
    mealCalories(
      meals.breakfast.items,
    ) +

    mealCalories(
      meals.lunch.items,
    ) +

    mealCalories(
      meals.dinner.items,
    )
  )
}

