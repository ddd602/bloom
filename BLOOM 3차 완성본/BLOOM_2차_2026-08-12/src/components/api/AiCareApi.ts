import { apiFetch } from './ApiClient'

export type ProcedureRecommendationItem = {
  procedureId: string
  name: string
  description: string
  reason: string
  estimatedSessions: string | null
  interval: string | null
  estimatedPrice: number | null
}

export type ProcedureRecommendationsResponse = {
  recommendations: ProcedureRecommendationItem[]
  generatedAt: string
}

export async function getProcedureRecommendations(
  bodyCheckId: string | number,
): Promise<ProcedureRecommendationsResponse> {
  return apiFetch<ProcedureRecommendationsResponse>(
    '/api/v1/ai/procedures/recommendations',
    {
      method: 'POST',
      body: JSON.stringify({
        bodyCheckId:
          Number(
            bodyCheckId,
          ),
      }),
    },
  )
}