import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
  useNavigate,
} from 'react-router-dom'

import ExerciseProgressPanel from '../../components/Manage/ExerciseProgressPanel'
import RoutineSelectSheet from '../../components/Manage/RoutineSelectSheet'
import ScreenHeader from '../../components/ScreenHeader'

import {
  useExercise,
} from '../../components/context/ExerciseContext'

import {
  saveCompletedRoutineActivity,
} from '../../components/api/ExerciseApi'

// ==============================
// 숫자 두 자리
// ==============================

function pad(
  n: number,
) {
  return String(
    n,
  ).padStart(
    2,
    '0',
  )
}

// ==============================
// 초 → hh:mm:ss
// ==============================

function format(
  sec: number,
  sep = ' : ',
) {
  const h =
    Math.floor(
      sec / 3600,
    )

  const m =
    Math.floor(
      (
        sec % 3600
      ) / 60,
    )

  const s =
    sec % 60

  return [
    h,
    m,
    s,
  ]
    .map(
      pad,
    )
    .join(
      sep,
    )
}

// ==============================
// 오늘 날짜
// yyyy-MM-dd
// ==============================

function getTodayDate() {
  const today =
    new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      today.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}

// ==============================
// 재생 / 일시정지 아이콘
// ==============================

function PlayPause({
  paused,
}: {
  paused: boolean
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {paused ? (
        <path d="M8 5v14l11-7L8 5Z" />
      ) : (
        <>
          <rect
            x="7"
            y="5"
            width="4"
            height="14"
            rx="1"
          />

          <rect
            x="14"
            y="5"
            width="4"
            height="14"
            rx="1"
          />
        </>
      )}
    </svg>
  )
}

function ExerciseTimer() {
  const navigate =
    useNavigate()

  const {
    activeRoutine,
    completeActive,
    addUpcoming,
  } =
    useExercise()

  const [
    elapsed,
    setElapsed,
  ] =
    useState(0)

  const [
    running,
    setRunning,
  ] =
    useState(false)

  const [
    stopping,
    setStopping,
  ] =
    useState(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    saveError,
    setSaveError,
  ] =
    useState('')

  const [
    selectOpen,
    setSelectOpen,
  ] =
    useState(false)

  const target =
    activeRoutine
      ? activeRoutine.minutes *
        60
      : 0

  // ==============================
  // 타이머
  // ==============================

  useEffect(() => {
    if (!running) {
      return
    }

    const id =
      setInterval(
        () => {
          setElapsed(
            (e) =>
              e + 1,
          )
        },
        1000,
      )

    return () =>
      clearInterval(
        id,
      )
  }, [
    running,
  ])

  // ==============================
  // 목표 시간 도달
  // ==============================

  useEffect(() => {
    if (
      running &&
      target > 0 &&
      elapsed >= target
    ) {
      setRunning(
        false,
      )
    }
  }, [
    running,
    elapsed,
    target,
  ])

  // ==============================
  // 활성 루틴 없음
  // ==============================

  if (!activeRoutine) {
    return stopping
      ? null
      : (
        <Navigate
          to="/manage/exercise"
          replace
        />
      )
  }

  const shownElapsed =
    Math.min(
      elapsed,
      target,
    )

  const remaining =
    Math.max(
      0,
      target -
        elapsed,
    )

  const done =
    remaining === 0

  // ==============================
  // 루틴 완료
  //
  // 1. 서버 Activity 저장
  // 2. 저장 성공 후 Context 완료 처리
  // 3. 다음 루틴 또는 완료 페이지
  // ==============================

  const stop =
    async () => {
      if (
        saving
      ) {
        return
      }

      const finishedRoutine =
        activeRoutine

      setSaving(
        true,
      )

      setRunning(
        false,
      )

      setSaveError(
        '',
      )

      try {
        // 먼저 서버에 실제 활동 기록 저장
        await saveCompletedRoutineActivity(
          getTodayDate(),
          finishedRoutine,
        )

        // 서버 저장 성공 후에만 프론트 완료 처리
        const next =
          completeActive()

        if (next) {
          setElapsed(
            0,
          )

          setSaving(
            false,
          )

          return
        }

        setStopping(
          true,
        )

        navigate(
          '/manage/exercise/complete',
        )
      } catch (error) {
        console.error(
          '완료한 운동을 서버 활동 기록에 저장하지 못했습니다.',
          error,
        )

        setSaveError(
          '운동 기록 저장에 실패했어요. 다시 시도해주세요.',
        )

        setSaving(
          false,
        )
      }
    }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#F1FFF6]">

      <ScreenHeader title="운동하기" />

      {/* 타이머 */}
      <div className="flex flex-col items-center px-6 pt-[72px]">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              setRunning(
                (r) => !r,
              )
            }
            disabled={
              saving
            }
            aria-label={
              running
                ? '일시정지'
                : '재생'
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDF8E7] text-[#31C66B] disabled:opacity-40"
          >
            <PlayPause
              paused={
                !running
              }
            />
          </button>

          <span className="text-[34px] font-extrabold tracking-[3px] text-[#31C66B]">
            {format(
              shownElapsed,
            )}
          </span>

        </div>

        {done ? (
          <p className="mt-4 text-[11px] font-semibold text-[#31C66B]">
            루틴 완료! 그만하기를 눌러 저장하세요
          </p>
        ) : (
          <p className="mt-4 text-[11px] text-gray-400">
            루틴 종료까지&nbsp;&nbsp;

            <span className="font-semibold text-gray-600">
              -{' '}
              {format(
                remaining,
                ':',
              )}
            </span>
          </p>
        )}

        {saveError && (
          <p className="mt-3 text-[10px] font-medium text-red-500">
            {saveError}
          </p>
        )}

        <button
          type="button"
          onClick={
            stop
          }
          disabled={
            saving
          }
          className="mt-7 rounded-full bg-[#BEBEBE] px-9 py-2.5 text-[12px] font-semibold text-white transition-colors active:bg-gray-400 disabled:opacity-50"
        >
          {saving
            ? '저장 중...'
            : '그만하기'}
        </button>

      </div>

      {/* 드래그 가능한 바텀시트 */}
      <ExerciseProgressPanel
        remainingLabel={
          `- ${format(
            remaining,
            ':',
          )}`
        }
        onAddRoutine={() =>
          setSelectOpen(
            true,
          )
        }
      />

      <RoutineSelectSheet
        open={
          selectOpen
        }
        onClose={() =>
          setSelectOpen(
            false,
          )
        }
        onSelect={(
          routine,
        ) => {
          addUpcoming(
            routine,
          )

          setSelectOpen(
            false,
          )
        }}
      />

    </div>
  )
}

export default ExerciseTimer