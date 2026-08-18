import {
  useEffect,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import ConditionSummary from '../components/condition/ConditionSummary'
import ConditionCard from '../components/condition/ConditionCard'
import ConditionMemo from '../components/condition/ConditionMemo'
import ConditionInput from '../components/condition/ConditionInput'
import { IconChevronLeft } from '../components/icons'

import {
  getConditionByDate,
  saveCondition,
} from '../components/api/ConditionApi'

function getTodayDate() {
  const today = new Date()

  const year =
    today.getFullYear()

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    today.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function ConditionDetail() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const selectedDate =
    location.state
      ?.selectedDate ??
    getTodayDate()

  const [
    emotionScore,
    setEmotionScore,
  ] =
    useState(0)

  const [
    bodyScore,
    setBodyScore,
  ] =
    useState(0)

  const [
    emotionTags,
    setEmotionTags,
  ] =
    useState<string[]>([])

  const [
    bodyTags,
    setBodyTags,
  ] =
    useState<string[]>([])

  const [
    memo,
    setMemo,
  ] =
    useState('')

  const [
    inputOpen,
    setInputOpen,
  ] =
    useState(false)

  const [
    memoEditing,
    setMemoEditing,
  ] =
    useState(false)

  // ==========================
  // 선택한 날짜 컨디션 조회
  // ==========================

  useEffect(() => {
    const loadCondition =
      async () => {
        try {
          const data =
            await getConditionByDate(
              selectedDate,
            )

          setEmotionScore(
            data.emotionScore,
          )

          setBodyScore(
            data.bodyScore,
          )

          setEmotionTags(
            data.emotionTags,
          )

          setBodyTags(
            data.bodyTags,
          )

          setMemo(
            data.memo,
          )
        } catch (error) {
          console.error(
            '컨디션 데이터를 불러오지 못했습니다.',
            error,
          )

          setEmotionScore(0)
          setBodyScore(0)
          setEmotionTags([])
          setBodyTags([])
          setMemo('')
        }
      }

    loadCondition()
  }, [selectedDate])

  // ==========================
  // 현재 컨디션 전체 저장
  // ==========================

  const saveCurrentCondition =
    async () => {
      const saved =
        await saveCondition({
          date:
            selectedDate,

          emotionScore,

          bodyScore,

          emotionTags,

          bodyTags,

          memo,
        })

      setEmotionScore(
        saved.emotionScore,
      )

      setBodyScore(
        saved.bodyScore,
      )

      setEmotionTags(
        saved.emotionTags,
      )

      setBodyTags(
        saved.bodyTags,
      )

      setMemo(
        saved.memo,
      )

      return saved
    }

  // ==========================
  // 컨디션 입력 저장
  // ==========================

  const handleSaveCondition =
    async () => {
      try {
        await saveCurrentCondition()

        setInputOpen(
          false,
        )
      } catch (error) {
        console.error(
          '컨디션 저장에 실패했습니다.',
          error,
        )

        throw error
      }
    }

  // ==========================
  // 메모 수정 완료
  // ==========================

  const handleSaveMemo =
    async () => {
      try {
        await saveCurrentCondition()

        setMemoEditing(
          false,
        )
      } catch (error) {
        console.error(
          '메모 저장에 실패했습니다.',
          error,
        )

        throw error
      }
    }

  const overall =
    (emotionScore +
      bodyScore) /
    2

  const hasInput =
    emotionScore > 0 ||
    bodyScore > 0

  const makeToggle =
    (
      list: string[],
      setList: (
        v: string[],
      ) => void,
    ) =>
    (tag: string) => {
      setList(
        list.includes(tag)
          ? list.filter(
              (t) =>
                t !== tag,
            )
          : [
              ...list,
              tag,
            ],
      )
    }

  const toggleEmotion =
    makeToggle(
      emotionTags,
      setEmotionTags,
    )

  const toggleBody =
    makeToggle(
      bodyTags,
      setBodyTags,
    )

  return (
    <div className="relative flex h-full flex-col bg-white">

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
              onClick={() =>
                navigate(-1)
              }
              aria-label="뒤로가기"
              className="flex h-6 w-6 items-center justify-center text-gray-500"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>

            <h1 className="text-sm font-bold text-gray-900">
              일일 컨디션 세부 기록
            </h1>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">

        <ConditionSummary
          score={overall}
          note={
            hasInput
              ? '컨디션이 기록되었어요'
              : '아직 기록 전이에요. 오른쪽 아래 + 로 입력해보세요'
          }
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ConditionCard
            title="감정 컨디션"
            score={
              emotionScore
            }
            tags={
              emotionTags
            }
          />

          <ConditionCard
            title="신체 컨디션"
            score={
              bodyScore
            }
            tags={
              bodyTags
            }
          />
        </div>

        <div className="mt-3">
          <ConditionMemo
            value={memo}
            onChange={
              setMemo
            }
            editing={
              memoEditing
            }
            onEditingChange={
              setMemoEditing
            }
            onSave={
              handleSaveMemo
            }
          />
        </div>
      </div>

      {!memoEditing && (
        <button
          type="button"
          onClick={() =>
            setInputOpen(
              true,
            )
          }
          aria-label="컨디션 입력"
          className="
            absolute bottom-5 right-5
            flex h-12 w-12 items-center justify-center
            rounded-full
            bg-[#31C66B]
            text-2xl leading-none text-white
            shadow-md
            active:scale-95
          "
        >
          +
        </button>
      )}

      <ConditionInput
        open={
          inputOpen
        }
        onClose={() =>
          setInputOpen(
            false,
          )
        }
        onSave={
          handleSaveCondition
        }
        emotionScore={
          emotionScore
        }
        onEmotionScore={
          setEmotionScore
        }
        bodyScore={
          bodyScore
        }
        onBodyScore={
          setBodyScore
        }
        emotionTags={
          emotionTags
        }
        onToggleEmotion={
          toggleEmotion
        }
        bodyTags={
          bodyTags
        }
        onToggleBody={
          toggleBody
        }
      />
    </div>
  )
}

export default ConditionDetail