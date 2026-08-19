import { apiFetch } from './ApiClient'
import type { MealType } from './MealApi'

export type MealRecommendationRequest = {
  date: string
  mealType: Extract<
    MealType,
    'BREAKFAST' | 'LUNCH' | 'DINNER'
  >
}

export type RecommendedFoodItem = {
  foodName: string
  amount: number | null
  amountUnit: string | null
  kcal: number | null
  carbs: number | null
  protein: number | null
  fat: number | null
}

export type MealRecommendationResponse = {
  title: string
  description: string
  foods: RecommendedFoodItem[]
  totalKcal: number | null
  totalCarbs: number | null
  totalProtein: number | null
  totalFat: number | null
  reason: string
  generatedAt: string
}

export async function getMealRecommendation(
  request: MealRecommendationRequest,
): Promise<MealRecommendationResponse> {
  return apiFetch<MealRecommendationResponse>(
    '/api/v1/ai/meals/recommendations',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )
}