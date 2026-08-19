import { apiFetch } from './ApiClient'

export type AiReportStatus =
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

export type AiReportItem = {
  title: string
  description: string
}

export type AiReportResponse = {
  reportId: number
  from: string
  to: string

  status: AiReportStatus

  summary: string | null

  priorities: AiReportItem[]
  methods: AiReportItem[]

  generatedAt: string
}

export type CreateAiReportRequest = {
  from: string
  to: string
}

// ==============================
// AI 리포트 생성
// ==============================

export async function createAiReport(
  data: CreateAiReportRequest,
): Promise<AiReportResponse> {
  return apiFetch<AiReportResponse>(
    '/api/v1/ai/reports',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

// ==============================
// 특정 AI 리포트 조회
// ==============================

export async function getAiReportById(
  reportId: number,
): Promise<AiReportResponse> {
  return apiFetch<AiReportResponse>(
    `/api/v1/ai/reports/${reportId}`,
  )
}

// ==============================
// 가장 최근 AI 리포트 조회
// ==============================

export async function getLatestAiReport(): Promise<AiReportResponse> {
  return apiFetch<AiReportResponse>(
    '/api/v1/ai/reports/latest',
  )
}