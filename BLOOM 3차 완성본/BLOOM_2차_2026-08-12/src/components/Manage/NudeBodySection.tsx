import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  getLatestNudeBodyPhoto,
  type NudeBodyPhoto,
} from '../api/NudeBodyApi'

import {
  getPrivateImageUrl,
} from '../api/ImageUploadApi'

import { IconChevronRight } from '../icons'

function NudeBodySection({ to }: { to: string }) {
  const navigate = useNavigate()

  const [
    latest,
    setLatest,
  ] =
    useState<NudeBodyPhoto | null>(null)

  const [
    photoUrl,
    setPhotoUrl,
  ] =
    useState<string | null>(null)

  const [
    expectedPhotoUrl,
    setExpectedPhotoUrl,
  ] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    let originalObjectUrl:
      | string
      | null = null

    let expectedObjectUrl:
      | string
      | null = null

    const loadPhoto =
      async () => {
        try {
          const result =
            await getLatestNudeBodyPhoto()

          if (cancelled) {
            return
          }

          setLatest(
            result,
          )

          // ==============================
          // 현재 눈바디 이미지
          // 보호된 이미지이므로 Blob URL 변환
          // ==============================

          if (
            result?.image
          ) {
            const displayUrl =
              await getPrivateImageUrl(
                result.image,
              )

            if (
              displayUrl.startsWith(
                'blob:',
              )
            ) {
              originalObjectUrl =
                displayUrl
            }

            if (
              !cancelled
            ) {
              setPhotoUrl(
                displayUrl,
              )
            }
          } else {
            setPhotoUrl(
              null,
            )
          }

          // ==============================
          // AI 예상 이미지
          // ==============================

          if (
            result?.expectedImageUrl
          ) {
            const displayUrl =
              await getPrivateImageUrl(
                result.expectedImageUrl,
              )

            if (
              displayUrl.startsWith(
                'blob:',
              )
            ) {
              expectedObjectUrl =
                displayUrl
            }

            if (
              !cancelled
            ) {
              setExpectedPhotoUrl(
                displayUrl,
              )
            }
          } else {
            setExpectedPhotoUrl(
              null,
            )
          }
        } catch (error) {
          console.error(
            '눈바디 사진을 불러오지 못했습니다.',
            error,
          )
        }
      }

    void loadPhoto()

    return () => {
      cancelled =
        true

      if (
        originalObjectUrl
      ) {
        URL.revokeObjectURL(
          originalObjectUrl,
        )
      }

      if (
        expectedObjectUrl
      ) {
        URL.revokeObjectURL(
          expectedObjectUrl,
        )
      }
    }
  }, [])

  return (
    <section>
      <Link
        to={to}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-[14px] font-bold text-gray-900">
            AI 눈바디 변화 측정
          </h2>

          <p className="mt-1 text-[8px] text-gray-400">
            사진 분석 결과는 AI 추정치이며, 실제와 차이가 있을 수 있어요
          </p>
        </div>

        <IconChevronRight className="h-6 w-6 text-gray-400" />
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center">

          <button
            type="button"
            onClick={() =>
              navigate(
                to,
                {
                  state: {
                    openCamera:
                      true,
                  },
                },
              )
            }
            aria-label="눈바디 촬영"
            className="flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[#CFCFCF] text-white"
          >
            {photoUrl ? (
              <img
                src={
                  photoUrl
                }
                alt="눈바디 사진"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={
                    1.4
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7"
                >
                  <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />

                  <circle
                    cx="12"
                    cy="13"
                    r="3.2"
                  />
                </svg>

                <span className="mt-2 text-center text-[8px] leading-[11px] text-white/80">
                  이주의 눈바디를
                  <br />
                  촬영해 주세요!
                </span>
              </>
            )}
          </button>

          <p className="mt-2 text-[10px] font-bold text-gray-900">
            Before{' '}
            <span className="font-normal text-gray-400">
              Now
            </span>
          </p>

          <p className="mt-0.5 text-[8px] text-gray-400">
            현재 눈바디
          </p>
        </div>

        <div className="flex flex-col items-center">

          <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg bg-[#E5E5E5]">

            {expectedPhotoUrl ? (
              <img
                src={
                  expectedPhotoUrl
                }
                alt="AI 예상 이미지"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[9px] text-gray-400">
                AI 예상 이미지
              </span>
            )}

          </div>

          <p className="mt-2 text-[10px] font-bold text-gray-900">
            After{' '}
            <span className="font-normal text-gray-400">
              AI
            </span>
          </p>

          <p className="mt-0.5 text-[8px] text-[#31C66B]">
            {latest?.analysisStatus ===
            'COMPLETED'
              ? 'AI 분석 완료'
              : latest?.analysisStatus ===
                'ANALYZING'
                ? 'AI 분석 중'
                : latest?.analysisStatus ===
                  'FAILED'
                  ? 'AI 분석 실패'
                  : 'AI 분석 전'}
          </p>

        </div>
      </div>
    </section>
  )
}

export default NudeBodySection