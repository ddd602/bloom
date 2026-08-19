import { apiFetch } from './ApiClient'

export type BodyCheckAnalysisStatus =
  | 'NOT_REQUESTED'
  | 'ANALYZING'
  | 'COMPLETED'
  | 'FAILED'

export type NudeBodyPhoto = {
  id: string
  image: string
  date: string
  createdAt: string
  updatedAt: string
  expectedImageUrl: string | null
  analysisStatus: BodyCheckAnalysisStatus
}

type BodyCheckResponse = {
  bodyCheckId: number
  recordedDate: string
  originalImageUrl: string
  expectedImageUrl: string | null
  analysisStatus: BodyCheckAnalysisStatus
  createdAt: string
  updatedAt: string
}

type BodyCheckCreateRequest = {
  recordedDate: string
  originalImageUrl: string
}

type BodyCheckPatchRequest = {
  recordedDate?: string
  originalImageUrl?: string
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function toNudeBodyPhoto(
  bodyCheck: BodyCheckResponse,
): NudeBodyPhoto {
  return {
    id: String(bodyCheck.bodyCheckId),
    image: bodyCheck.originalImageUrl,
    date: bodyCheck.recordedDate,
    createdAt: bodyCheck.createdAt,
    updatedAt: bodyCheck.updatedAt,
    expectedImageUrl: bodyCheck.expectedImageUrl ?? null,
    analysisStatus: bodyCheck.analysisStatus,
  }
}

export async function getNudeBodyPhotos(): Promise<NudeBodyPhoto[]> {
  const result = await apiFetch<BodyCheckResponse[]>(
    '/api/v1/care/body-checks',
  )

  return result.map(toNudeBodyPhoto)
}

export async function getNudeBodyPhotosByDate(
  date: string,
): Promise<NudeBodyPhoto[]> {
  const photos = await getNudeBodyPhotos()

  return photos.filter((photo) => photo.date === date)
}

export async function getLatestNudeBodyPhoto(): Promise<NudeBodyPhoto | null> {
  const photos = await getNudeBodyPhotos()

  if (photos.length === 0) return null

  return [...photos].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )[0]
}

export async function getNudeBodyPhoto(
  id: string,
): Promise<NudeBodyPhoto> {
  const result = await apiFetch<BodyCheckResponse>(
    `/api/v1/care/body-checks/${id}`,
  )

  return toNudeBodyPhoto(result)
}

export async function createNudeBodyPhotoRecord(
  originalImageUrl: string,
  date: string = getTodayDate(),
): Promise<NudeBodyPhoto> {
  const request: BodyCheckCreateRequest = {
    recordedDate: date,
    originalImageUrl,
  }

  const result = await apiFetch<BodyCheckResponse>(
    '/api/v1/care/body-checks',
    {
      method: 'POST',
      body: JSON.stringify(request),
    },
  )

  return toNudeBodyPhoto(result)
}

// image에는 data URL/blob URL이 아니라
// 외부에서 접근 가능한 실제 이미지 URL이 들어와야 합니다.
export async function saveNudeBodyPhoto(
  image: string,
  date: string = getTodayDate(),
): Promise<NudeBodyPhoto> {
  return createNudeBodyPhotoRecord(image, date)
}

export async function updateNudeBodyPhoto(
  id: string,
  request: BodyCheckPatchRequest,
): Promise<NudeBodyPhoto> {
  const result = await apiFetch<BodyCheckResponse>(
    `/api/v1/care/body-checks/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    },
  )

  return toNudeBodyPhoto(result)
}

export async function deleteNudeBodyPhoto(
  id: string,
): Promise<void> {
  await apiFetch<void>(
    `/api/v1/care/body-checks/${id}`,
    {
      method: 'DELETE',
    },
  )
}

export async function requestNudeBodyAnalysis(
  id: string,
): Promise<NudeBodyPhoto> {
  const result = await apiFetch<BodyCheckResponse>(
    `/api/v1/care/body-checks/${id}/analysis`,
    {
      method: 'POST',
    },
  )

  return toNudeBodyPhoto(result)
}