import { apiFetch } from './ApiClient'
import type { MealType } from './MealApi'

export type NutritionAnalysisStatus =
  | 'PROCESSING'
  | 'DRAFT'
  | 'RECORDED'
  | 'FAILED'
  | 'CANCELLED'

export type NutritionFoodSource =
  | 'MFDS'
  | 'AI_ESTIMATE'
  | 'USER_INPUT'
  | string

export type NutritionDraftFood = {
  draftFoodId: number
  foodName: string
  amount: number | null
  amountUnit: string | null
  kcal: number | null
  carbs: number | null
  protein: number | null
  fat: number | null
  confidence: number | null
  source: NutritionFoodSource
}

export type NutritionAnalysisResponse = {
  analysisId: number
  status: NutritionAnalysisStatus
  modelVersion: string
  foods: NutritionDraftFood[]
  totalKcal: number | null
  manualInputAvailable?: boolean
}

export type NutritionDraftFoodPatchRequest = {
  foodName?: string
  amount?: number | null
  amountUnit?: string | null
  kcal?: number | null
  carbs?: number | null
  protein?: number | null
  fat?: number | null
}

export type NutritionDraftFoodCreateRequest = {
  foodName: string
  amount?: number | null
  amountUnit?: string | null
  kcal?: number | null
  carbs?: number | null
  protein?: number | null
  fat?: number | null
}

export async function analyzeNutritionImage(
  date: string,
  mealType: MealType,
  image: File | Blob,
): Promise<NutritionAnalysisResponse> {
  const formData = new FormData()

  formData.append('date', date)
  formData.append('mealType', mealType)
  formData.append('inputType', 'IMAGE')
  formData.append(
    'image',
    image,
    image instanceof File
      ? image.name
      : `meal-${Date.now()}.jpg`,
  )

  return apiFetch<NutritionAnalysisResponse>(
    '/api/v1/ai/nutrition/analyses',
    {
      method: 'POST',
      body: formData,
    },
  )
}

export async function analyzeNutritionText(
  date: string,
  mealType: MealType,
  text: string,
): Promise<NutritionAnalysisResponse> {
  const formData = new FormData()

  formData.append('date', date)
  formData.append('mealType', mealType)
  formData.append('inputType', 'TEXT')
  formData.append('text', text)

  return apiFetch<NutritionAnalysisResponse>(
    '/api/v1/ai/nutrition/analyses',
    {
      method: 'POST',
      body: formData,
    },
  )
}

export async function getNutritionAnalysis(
  analysisId: number,
): Promise<NutritionAnalysisResponse> {
  return apiFetch<NutritionAnalysisResponse>(
    `/api/v1/ai/nutrition/analyses/${analysisId}`,
  )
}

export async function updateNutritionDraftFood(
  analysisId: number,
  draftFoodId: number,
  data: NutritionDraftFoodPatchRequest,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/api/v1/ai/nutrition/analyses/${analysisId}/foods/${draftFoodId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}

export async function addNutritionDraftFood(
  analysisId: number,
  data: NutritionDraftFoodCreateRequest,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/api/v1/ai/nutrition/analyses/${analysisId}/foods`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export async function deleteNutritionDraftFood(
  analysisId: number,
  draftFoodId: number,
): Promise<void> {
  await apiFetch<void>(
    `/api/v1/ai/nutrition/analyses/${analysisId}/foods/${draftFoodId}`,
    {
      method: 'DELETE',
    },
  )
}

export async function recordNutritionAnalysis(
  analysisId: number,
): Promise<unknown> {
  return apiFetch<unknown>(
    `/api/v1/ai/nutrition/analyses/${analysisId}/record`,
    {
      method: 'POST',
    },
  )
}

export async function cancelNutritionAnalysis(
  analysisId: number,
): Promise<void> {
  await apiFetch<void>(
    `/api/v1/ai/nutrition/analyses/${analysisId}`,
    {
      method: 'DELETE',
    },
  )
}