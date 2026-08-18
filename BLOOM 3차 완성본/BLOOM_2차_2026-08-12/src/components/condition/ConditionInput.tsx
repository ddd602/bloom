import {
  useRef,
  useState,
} from 'react'

import StarRating from './StarRating'
import ConditionTags from './ConditionTags'
import { EMOTION_POOL } from '../types/option'
import { IconChevronLeft } from '../icons'

type Props = {
  open: boolean
  onClose: () => void
  onSave: () => Promise<void>

  emotionScore: number
  onEmotionScore: (v: number) => void

  bodyScore: number
  onBodyScore: (v: number) => void

  emotionTags: string[]
  onToggleEmotion: (tag: string) => void

  bodyTags: string[]
  onToggleBody: (tag: string) => void
}

function SelectedRow({
  tags,
}: {
  tags: string[]
}) {
  if (tags.length === 0) {
    return (
      <p className="text-[10px] text-gray-300">
        선택된 항목이 없어요
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(
        (tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-[#31C66B]
              px-2.5 py-1
              text-[10px] font-medium text-white
            "
          >
            {tag}
          </span>
        ),
      )}
    </div>
  )
}

function ConditionInput({
  open,
  onClose,
  onSave,
  emotionScore,
  onEmotionScore,
  bodyScore,
  onBodyScore,
  emotionTags,
  onToggleEmotion,
  bodyTags,
  onToggleBody,
}: Props) {
  const snapshotRef =
    useRef('')

  const prevOpen =
    useRef(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const current =
    JSON.stringify({
      emotionScore,

      bodyScore,

      emotionTags:
        [...emotionTags].sort(),

      bodyTags:
        [...bodyTags].sort(),
    })

  if (
    open &&
    !prevOpen.current
  ) {
    snapshotRef.current =
      current
  }

  prevOpen.current =
    open

  if (!open) {
    return null
  }

  const changed =
    snapshotRef.current !==
    current

  const handleSave =
    async () => {
      if (
        !changed ||
        saving
      ) {
        return
      }

      try {
        setSaving(
          true,
        )

        await onSave()
      } catch (error) {
        console.error(
          '컨디션 저장에 실패했습니다.',
          error,
        )
      } finally {
        setSaving(
          false,
        )
      }
    }

  return (
    <div
      className="
        absolute inset-0 z-50
        flex h-full w-full
        flex-col bg-white
      "
    >
      {/* 헤더 */}
      <header
        className="shrink-0 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                onClose
              }
              aria-label="뒤로가기"
              className="flex h-6 w-6 items-center justify-center text-gray-500"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>

            <h1 className="text-sm font-bold text-gray-900">
              일일 컨디션 정보 입력하기
            </h1>
          </div>
        </div>
      </header>

      {/* 스크롤 영역 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-7">

        {/* 감정 컨디션 */}
        <section>
          <p className="text-[12px] font-semibold text-gray-700">
            오늘의 감정 컨디션
          </p>

          <div className="mt-5 flex flex-col items-center">
            <StarRating
              score={
                emotionScore
              }
              onChange={
                onEmotionScore
              }
              size={30}
            />

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[17px] font-bold text-gray-600">
                {emotionScore.toFixed(
                  1,
                )}
              </span>

              <span className="text-[10px] text-gray-400">
                / 5.0
              </span>
            </div>
          </div>

          <p className="mt-4 text-[10px] font-semibold text-gray-700">
            세부 감정 기록
          </p>

          <div className="mt-2">
            <SelectedRow
              tags={
                emotionTags
              }
            />
          </div>

          <div className="mt-2 rounded-lg bg-[#FAFAFA] p-3">
            <ConditionTags
              options={
                EMOTION_POOL
              }
              selected={
                emotionTags
              }
              onToggle={
                onToggleEmotion
              }
            />
          </div>
        </section>

        {/* 신체 컨디션 */}
        <section className="mt-7">
          <p className="text-[12px] font-semibold text-gray-700">
            오늘의 신체 컨디션
          </p>

          <div className="mt-5 flex flex-col items-center">
            <StarRating
              score={
                bodyScore
              }
              onChange={
                onBodyScore
              }
              size={30}
            />

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[17px] font-bold text-gray-600">
                {bodyScore.toFixed(
                  1,
                )}
              </span>

              <span className="text-[10px] text-gray-400">
                / 5.0
              </span>
            </div>
          </div>

          <p className="mt-4 text-[10px] font-semibold text-gray-700">
            세부 컨디션 기록
          </p>

          <div className="mt-2">
            <SelectedRow
              tags={
                bodyTags
              }
            />
          </div>

          {/* 신체 세부 카드 */}
          <div className="mt-2 rounded-lg bg-[#FAFAFA] p-3">

            {/* 생리주기 */}
            <div className="flex items-start gap-4">
              <p className="w-[48px] shrink-0 pt-1 text-[10px] font-semibold text-gray-600">
                생리주기
              </p>

              <ConditionTags
                options={[
                  '생리중',
                  '가임기',
                  '배란기',
                ]}
                selected={
                  bodyTags
                }
                onToggle={
                  onToggleBody
                }
              />
            </div>

            {/* 신체상태 */}
            <div className="mt-3 flex items-start gap-4">
              <p className="w-[48px] shrink-0 pt-1 text-[10px] font-semibold text-gray-600">
                신체상태
              </p>

              <ConditionTags
                options={[
                  '피곤함',
                  '붓기',
                  '허리 통증',
                  '골반 통증',
                  '근육통',
                ]}
                selected={
                  bodyTags
                }
                onToggle={
                  onToggleBody
                }
              />
            </div>

            {/* 식욕 */}
            <div className="mt-3 flex items-start gap-4">
              <p className="w-[48px] shrink-0 pt-1 text-[10px] font-semibold text-gray-600">
                식욕
              </p>

              <ConditionTags
                options={[
                  '식욕 저하',
                  '식욕 보통',
                  '식욕 증가',
                ]}
                selected={
                  bodyTags
                }
                onToggle={
                  onToggleBody
                }
              />
            </div>
          </div>
        </section>
      </div>

      {/* 저장 버튼 */}
      <div className="shrink-0 px-5 pb-5 pt-2">
        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            !changed ||
            saving
          }
          className={
            'w-full rounded-full py-3 text-sm font-bold transition-colors ' +
            (
              changed &&
              !saving
                ? 'bg-[#31C66B] text-white active:bg-[#29B760]'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            )
          }
        >
          {saving
            ? '저장 중...'
            : '저장하기'}
        </button>
      </div>
    </div>
  )
}

export default ConditionInput