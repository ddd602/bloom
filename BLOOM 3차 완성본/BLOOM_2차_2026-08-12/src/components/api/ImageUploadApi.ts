import { apiFetch } from './ApiClient'
import {
  getAccessToken,
  reissueTokens,
  clearTokens,
} from './AuthApi'

export type ImagePurpose =
  | 'BODY_CHECK'
  | 'NUTRITION'

export type ImageUploadResponse = {
  imageUrl: string
  contentType: string
  size: number
}

// ==============================
// 이미지 업로드
//
// POST /api/v1/uploads/images
// multipart/form-data
// ==============================

export async function uploadImage(
  file: File,
  purpose: ImagePurpose,
): Promise<ImageUploadResponse> {
  const formData =
    new FormData()

  formData.append(
    'file',
    file,
  )

  return apiFetch<ImageUploadResponse>(
    `/api/v1/uploads/images?purpose=${encodeURIComponent(
      purpose,
    )}`,
    {
      method: 'POST',
      body: formData,
    },
  )
}

// ==============================
// 비공개 이미지 조회
//
// GET /api/v1/uploads/images/{imageId}
//
// Bearer 인증이 필요해서
// <img src="">로 바로 표시할 수 없음.
// Blob으로 받아 Object URL로 변환.
// ==============================

export async function getPrivateImageUrl(
  imageUrl: string,
): Promise<string> {
  const fetchImage =
    async () => {
      const token =
        getAccessToken()

      return fetch(
        imageUrl,
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : undefined,
        },
      )
    }

  let response =
    await fetchImage()

  if (
    response.status === 401
  ) {
    try {
      await reissueTokens()
      response =
        await fetchImage()
    } catch (error) {
      clearTokens()
      throw error
    }
  }

  if (!response.ok) {
    throw new Error(
      `이미지 조회 실패 (${response.status})`,
    )
  }

  const blob =
    await response.blob()

  return URL.createObjectURL(
    blob,
  )
}