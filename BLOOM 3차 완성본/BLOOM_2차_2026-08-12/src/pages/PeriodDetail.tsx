import {
  useEffect,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import ScreenHeader from '../components/ScreenHeader'

import {
  getPeriods,
  type Period,
} from '../components/api/PeriodApi'

import {
  getPeriodLogByDate,
} from '../components/api/PeriodLogApi'

import {
  addDays,
  periodStatus,
  type PeriodTone,
} from '../components/calender/periodUtils'

import {
  formatKoreanDate,
} from '../components/api/ScheduleApi'

function getTodayDate() {
  const today = new Date()

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

// 단계별 색상
const TAG_CLASS:
  Record<
    PeriodTone,
    string
  > = {
  green:
    'bg-[#32C878] text-white',

  yellow:
    'bg-[#FCE7A6] text-[#B7860B]',

  gray:
    'bg-gray-200 text-gray-600',
}

function PeriodDetail() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const selectedDate =
    location.state
      ?.selectedDate ??
    getTodayDate()

  const [
    periods,
    setPeriods,
  ] =
    useState<
      Period[]
    >([])

  const [
    moodTags,
    setMoodTags,
  ] =
    useState<
      string[]
    >([])

  const [
    symptomTags,
    setSymptomTags,
  ] =
    useState<
      string[]
    >([])

  // =========================
  // 생리 기간 조회
  // =========================

  useEffect(() => {
    const loadPeriods =
      async () => {
        try {
          const data =
            await getPeriods()

          setPeriods(
            data,
          )
        } catch (error) {
          console.error(
            '생리 기록을 불러오지 못했습니다.',
            error,
          )

          setPeriods([])
        }
      }

    void loadPeriods()
  }, [])

  // =========================
  // 선택 날짜 세부 기록 조회
  // =========================

  useEffect(() => {
    const loadLog =
      async () => {
        try {
          const log =
            await getPeriodLogByDate(
              selectedDate,
            )

          setMoodTags(
            log.moodTags,
          )

          setSymptomTags(
            log.symptomTags,
          )
        } catch (error) {
          console.error(
            '생리 세부 기록을 불러오지 못했습니다.',
            error,
          )

          setMoodTags([])
          setSymptomTags([])
        }
      }

    void loadLog()
  }, [selectedDate])

  const openLogInput =
    () => {
      navigate(
        '/periodLogInput',
        {
          state: {
            selectedDate,
          },
        },
      )
    }

  const status =
    periodStatus(
      selectedDate,
      periods,
    )

  const nextDateLabel =
    status &&
    status.daysUntilNext !=
      null &&
    status.daysUntilNext >
      0
      ? formatKoreanDate(
          addDays(
            selectedDate,
            status.daysUntilNext,
          ),
        )
      : null

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="생리 세부기록" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">

        {/* 현재 주기 */}
        <p className="text-[11px] font-semibold text-gray-700">
          현재 주기
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={
              'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ' +
              TAG_CLASS.green
            }
          >
            {status
              ? status.phase
              : '기록 없음'}

            {status?.phase ===
              '생리중' &&
            status.dayInPeriod
              ? ` ${status.dayInPeriod}일차`
              : ''}
          </span>

          {status
            ?.daysUntilNext !=
            null &&
          status.daysUntilNext >
            0 ? (
            <span className="text-[13px] text-gray-700">
              예정일까지{' '}

              <b className="text-[#32C878]">
                {
                  status.daysUntilNext
                }
                일
              </b>
            </span>
          ) : null}
        </div>

        {nextDateLabel && (
          <p className="mt-2 text-[10px] font-semibold text-[#32C878]">
            생리예정일:{' '}
            {nextDateLabel}
          </p>
        )}

        {/* 세부 기록 */}
        <div className="mt-6 grid grid-cols-2 gap-3">

          {/* 기분 */}
          <button
            type="button"
            onClick={
              openLogInput
            }
            className="min-h-[80px] rounded-[5px] bg-[#FAFAFA] p-3 text-left"
          >
            <p className="text-[11px] font-semibold text-gray-700">
              기분
            </p>

            {moodTags.length >
            0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {moodTags.map(
                  (tag) => (
                    <span
                      key={
                        tag
                      }
                      className="rounded-full bg-[#31C66B] px-2 py-0.5 text-[9px] font-medium text-white"
                    >
                      {
                        tag
                      }
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-[15px] font-bold text-gray-400">
                없음
              </p>
            )}
          </button>

          {/* 통증 / 증상 */}
          <button
            type="button"
            onClick={
              openLogInput
            }
            className="min-h-[80px] rounded-[5px] bg-[#FAFAFA] p-3 text-left"
          >
            <p className="text-[11px] font-semibold text-gray-700">
              통증
            </p>

            {symptomTags.length >
            0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {symptomTags.map(
                  (tag) => (
                    <span
                      key={
                        tag
                      }
                      className="rounded-full bg-[#31C66B] px-2 py-0.5 text-[9px] font-medium text-white"
                    >
                      {
                        tag
                      }
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-[15px] font-bold text-gray-400">
                없음
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PeriodDetail