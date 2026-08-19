import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import ScreenHeader from '../components/ScreenHeader'
import NudeBodyCamera from '../components/Manage/NudeBodyCamera'

import {
  createNudeBodyPhotoRecord,
  getLatestNudeBodyPhoto,
  type NudeBodyPhoto,
} from '../components/api/NudeBodyApi'

import {
  uploadImage,
  getPrivateImageUrl,
} from '../components/api/ImageUploadApi'

import {
  getProcedureRecommendations,
  type ProcedureRecommendationItem,
} from '../components/api/AiCareApi'

export default function NudeBodyDetail() {
  const location = useLocation()

  const [record, setRecord] =
    useState<NudeBodyPhoto | null>(null)

  const [photo, setPhoto] =
    useState<string | null>(null)


  const [cameraOpen, setCameraOpen] =
    useState(
      () =>
        !!location.state
          ?.openCamera,
    )

  const [uploading, setUploading] =
    useState(false)

  const [saveMessage, setSaveMessage] =
    useState('')


  const [
    recommendations,
    setRecommendations,
  ] =
    useState<ProcedureRecommendationItem[]>([])

  const [
    recommendationLoading,
    setRecommendationLoading,
  ] =
    useState(false)

  const [
    recommendationMessage,
    setRecommendationMessage,
  ] =
    useState('')

  // ==============================
  // 기존 눈바디 조회
  // ==============================

  useEffect(() => {
    let cancelled = false

    let photoObjectUrl:
      | string
      | null = null


    const loadPhoto =
      async () => {
        try {
          const latest =
            await getLatestNudeBodyPhoto()

          if (cancelled) {
            return
          }

          setRecord(latest)

          if (latest?.image) {
            const displayUrl =
              await getPrivateImageUrl(
                latest.image,
              )

            if (
              displayUrl.startsWith(
                'blob:',
              )
            ) {
              photoObjectUrl =
                displayUrl
            }

            if (!cancelled) {
              setPhoto(displayUrl)
            }
          } else {
            setPhoto(null)
          }


          if (
            location.state
              ?.openCamera &&
            latest
          ) {
            setCameraOpen(false)
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
      cancelled = true

      if (photoObjectUrl) {
        URL.revokeObjectURL(
          photoObjectUrl,
        )
      }

    }
  }, [
    location.state,
  ])

  // ==============================
  // 사진 촬영
  // ==============================

  const onCapture =
    async (
      file: File,
      previewUrl: string,
    ) => {
      if (uploading) {
        URL.revokeObjectURL(
          previewUrl,
        )

        return
      }

      if (
        photo?.startsWith(
          'blob:',
        )
      ) {
        URL.revokeObjectURL(
          photo,
        )
      }

      setPhoto(previewUrl)
      setCameraOpen(false)
      setSaveMessage(
        '사진 저장 중...',
      )
      setUploading(true)

      try {
        const uploaded =
          await uploadImage(
            file,
          )

        const created =
          await createNudeBodyPhotoRecord(
            uploaded.imageUrl,
          )

        setRecord(created)

        // 새 눈바디를 저장하면 이전 추천 결과는 초기화
        setRecommendations([])
        setRecommendationMessage('')

        setSaveMessage(
          '눈바디 사진이 저장됐어요.',
        )
      } catch (error) {
        console.error(
          '눈바디 사진 저장 실패',
          error,
        )

        setSaveMessage(
          error instanceof Error
            ? error.message
            : '눈바디 사진 저장에 실패했어요.',
        )
      } finally {
        setUploading(false)
      }
    }

  // ==============================
  // 추천 시술
  // 자동 호출하지 않고 사용자가 버튼을 눌렀을 때만 요청
  // ==============================

  const requestRecommendations =
    async () => {
      if (
        !record ||
        recommendationLoading
      ) {
        return
      }

      try {
        setRecommendationLoading(
          true,
        )
        setRecommendationMessage('')

        const result =
          await getProcedureRecommendations(
            record.id,
          )

        setRecommendations(
          result.recommendations ??
            [],
        )

        if (
          !result.recommendations ||
          result.recommendations.length ===
            0
        ) {
          setRecommendationMessage(
            '추천 시술 결과가 없어요.',
          )
        }
      } catch (error) {
        console.error(
          '추천 시술을 불러오지 못했습니다.',
          error,
        )

        setRecommendations([])

        setRecommendationMessage(
          '추천 시술 기능을 아직 사용할 수 없어요.',
        )
      } finally {
        setRecommendationLoading(
          false,
        )
      }
    }


  return (
    <div className="relative flex h-full flex-col bg-white">
      <ScreenHeader title="AI 눈바디 변화 측정" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-7">
        <h2 className="text-[14px] font-bold text-gray-900">
          AI 눈바디 변화 측정
        </h2>

        <p className="mt-1 text-[9px] text-gray-400">
          눈바디 사진을 기록하고 현재 상태에 맞는 추천 관리를 확인해 보세요
        </p>

        <div className="mt-5">
          <div className="flex flex-col items-center">
            {photo ? (
              <button
                type="button"
                onClick={() =>
                  setCameraOpen(true)
                }
                disabled={uploading}
                className="aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-lg bg-gray-200 disabled:opacity-60"
                aria-label="눈바디 다시 촬영"
              >
                <img
                  src={photo}
                  alt="현재 눈바디"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCameraOpen(true)
                }
                disabled={uploading}
                className="flex aspect-[3/4] w-full max-w-[220px] flex-col items-center justify-center rounded-lg bg-[#D1D1D1] text-white disabled:opacity-60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
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
              </button>
            )}

            <p className="mt-2 text-[11px] font-bold text-gray-900">
              현재 눈바디
            </p>

            <p className="mt-0.5 text-[8px] text-gray-400">
              {uploading
                ? '사진 저장 중...'
                : record
                  ? '현재 기록된 눈바디'
                  : '눈바디를 촬영해 주세요'}
            </p>
          </div>
        </div>

        {saveMessage && (
          <p className="mt-3 rounded-lg bg-[#F7F7F7] px-3 py-2 text-[9px] leading-[14px] text-gray-500">
            {saveMessage}
          </p>
        )}


        <section className="mt-8">
          <h2 className="text-[14px] font-bold text-gray-900">
            추천 시술
          </h2>

          <p className="mt-1 text-[9px] text-gray-400">
            현재 눈바디를 기반으로 추천하는 관리예요
          </p>

          {record && (
            <button
              type="button"
              onClick={
                requestRecommendations
              }
              disabled={
                recommendationLoading ||
                uploading
              }
              className="mt-4 w-full rounded-full border border-[#31C66B] py-3 text-[11px] font-semibold text-[#31C66B] disabled:opacity-50"
            >
              {recommendationLoading
                ? '추천 시술 분석 중...'
                : recommendations.length >
                    0
                  ? '추천 시술 다시 분석하기'
                  : '추천 시술 분석하기'}
            </button>
          )}

          {!record ? (
            <div className="mt-4 flex min-h-[90px] items-center justify-center rounded-xl bg-[#F8F8F8] px-4 text-center text-[9px] leading-[14px] text-gray-400">
              눈바디 사진을 먼저 기록해 주세요.
            </div>
          ) : recommendationLoading ? (
            <div className="mt-4 flex h-[90px] items-center justify-center rounded-xl bg-[#F8F8F8] text-[9px] text-gray-400">
              추천 시술을 불러오는 중...
            </div>
          ) : recommendations.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recommendations.map(
                (item) => (
                  <div
                    key={
                      item.procedureId
                    }
                    className="rounded-xl bg-[#F8F8F8] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-gray-900">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-[8px] leading-[13px] text-gray-400">
                          {
                            item.description
                          }
                        </p>
                      </div>

                      {item.estimatedPrice !== null && (
                        <span className="shrink-0 text-[10px] font-bold text-[#E08A7D]">
                          {item.estimatedPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>

                    {item.reason && (
                      <p className="mt-2 text-[8px] leading-[13px] text-gray-500">
                        추천 이유 · {
                          item.reason
                        }
                      </p>
                    )}

                    {(item.estimatedSessions ||
                      item.interval) && (
                      <p className="mt-1 text-[8px] leading-[13px] text-gray-400">
                        {item.estimatedSessions
                          ? `예상 횟수 · ${item.estimatedSessions}`
                          : ''}
                        {item.estimatedSessions &&
                        item.interval
                          ? ' / '
                          : ''}
                        {item.interval
                          ? `간격 · ${item.interval}`
                          : ''}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-4 flex min-h-[90px] items-center justify-center rounded-xl bg-[#F8F8F8] px-4 text-center text-[9px] leading-[14px] text-gray-400">
              {recommendationMessage ||
                '추천 시술 분석 버튼을 눌러주세요.'}
            </div>
          )}
        </section>
      </div>

      {cameraOpen && (
        <NudeBodyCamera
          onCapture={
            onCapture
          }
          onClose={() =>
            setCameraOpen(
              false,
            )
          }
        />
      )}
    </div>
  )
}