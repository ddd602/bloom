import { apiFetch } from './ApiClient'
import {
  getAccessToken,
  reissueTokens,
  clearTokens,
} from './AuthApi'

export type ImageUploadResponse = {
  imageUrl: string
  contentType: string
  size: number
}

export async function uploadImage(
  file: File,
): Promise<ImageUploadResponse> {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('purpose', 'BODY_CHECK')

  return apiFetch<ImageUploadResponse>(
    '/api/v1/uploads/images',
    {
      method: 'POST',
      body: formData,
    },
  )
}

export async function getPrivateImageUrl(
  imageUrl: string,
): Promise<string> {
  const fetchImage = async () => {
    const token = getAccessToken()

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

  let response = await fetchImage()

  if (response.status === 401) {
    try {
      await reissueTokens()
      response = await fetchImage()
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

  const blob = await response.blob()

  return URL.createObjectURL(blob)
}