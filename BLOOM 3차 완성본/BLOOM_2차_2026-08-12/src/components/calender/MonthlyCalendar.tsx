import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import ScheduleSheet from './ScheduleSheet'

import {
  getDiaries,
  type Diary,
} from '../api/CalendarApi'

import {
  getPeriods,
  savePeriods,
  type Period,
} from '../api/PeriodApi'

import {
  getSchedules,
  addSchedule,
  deleteSchedule,
  type Schedule,
} from '../api/ScheduleApi'

import {
  expandPeriods,
  periodContaining,
} from './periodUtils'

import logoUrl from '../../assets/brand/logo.svg'

// ==============================
// YYYY-MM-DD 키 생성
// ==============================

function toKey(
  year: number,
  month: number,
  day: number,
) {
  const mm =
    String(
      month + 1,
    ).padStart(
      2,
      '0',
    )

  const dd =
    String(
      day,
    ).padStart(
      2,
      '0',
    )

  return `${year}-${mm}-${dd}`
}

// ==============================
// 해당 월 시작일 / 마지막일
// ==============================

function getMonthRange(
  year: number,
  month: number,
) {
  const from =
    toKey(
      year,
      month,
      1,
    )

  const lastDay =
    new Date(
      year,
      month + 1,
      0,
    ).getDate()

  const to =
    toKey(
      year,
      month,
      lastDay,
    )

  return {
    from,
    to,
  }
}

export default function MonthlyCalendar() {
  const navigate =
    useNavigate()

  const today =
    new Date()

  const [
    viewYear,
    setViewYear,
  ] =
    useState(
      today.getFullYear(),
    )

  const [
    viewMonth,
    setViewMonth,
  ] =
    useState(
      today.getMonth(),
    )

  const [
    pickerOpen,
    setPickerOpen,
  ] =
    useState(false)

  const [
    pickerYear,
    setPickerYear,
  ] =
    useState(
      today.getFullYear(),
    )

  const [
    diaries,
    setDiaries,
  ] =
    useState<Diary[]>(
      [],
    )

  const [
    periods,
    setPeriods,
  ] =
    useState<Period[]>(
      [],
    )

  const [
    schedules,
    setSchedules,
  ] =
    useState<
      Schedule[]
    >(
      [],
    )

  // ==============================
  // 생리 기록 모드
  // ==============================

  const [
    periodMode,
    setPeriodMode,
  ] =
    useState(false)

  const [
    pendingStart,
    setPendingStart,
  ] =
    useState<
      string | null
    >(
      null,
    )

  // ==============================
  // 일정 시트
  // ==============================

  const [
    sheetOpen,
    setSheetOpen,
  ] =
    useState(false)

  // ==============================
  // 우측 하단 +
  // ==============================

  const [
    fabOpen,
    setFabOpen,
  ] =
    useState(false)

  const todayKey =
    toKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      todayKey,
    )

  // ==============================
  // 일정 + 생리 기록
  //
  // localStorage 기반 기능
  // 처음 한 번만 불러옴
  // ==============================

  useEffect(() => {
    const loadLocalData =
      async () => {
        try {
          const [
            periodData,
            scheduleData,
          ] =
            await Promise.all([
              getPeriods(),
              getSchedules(),
            ])

          setPeriods(
            periodData,
          )

          setSchedules(
            scheduleData,
          )
        } catch (error) {
          console.error(
            '일정/생리 기록을 불러오지 못했습니다.',
            error,
          )
        }
      }

    loadLocalData()
  }, [])

  // ==============================
  // 서버 다이어리 메모 조회
  //
  // 보고 있는 월이 바뀔 때마다
  // 해당 월만 다시 조회
  // ==============================

  useEffect(() => {
    const loadDiaries =
      async () => {
        try {
          const {
            from,
            to,
          } =
            getMonthRange(
              viewYear,
              viewMonth,
            )

          const diaryData =
            await getDiaries(
              from,
              to,
            )

          setDiaries(
            diaryData,
          )
        } catch (error) {
          console.error(
            '다이어리 데이터를 불러오지 못했습니다.',
            error,
          )

          setDiaries(
            [],
          )
        }
      }

    loadDiaries()
  }, [
    viewYear,
    viewMonth,
  ])

  // ==============================
  // 달력 셀
  // ==============================

  const cells =
    useMemo(
      () => {
        const firstDay =
          new Date(
            viewYear,
            viewMonth,
            1,
          )

        const startOffset =
          (
            firstDay.getDay() +
            6
          ) %
          7

        const daysInMonth =
          new Date(
            viewYear,
            viewMonth + 1,
            0,
          ).getDate()

        const list:
          (
            number |
            null
          )[] =
          []

        for (
          let i = 0;
          i <
          startOffset;
          i++
        ) {
          list.push(
            null,
          )
        }

        for (
          let day = 1;
          day <=
          daysInMonth;
          day++
        ) {
          list.push(
            day,
          )
        }

        while (
          list.length %
            7 !==
          0
        ) {
          list.push(
            null,
          )
        }

        return list
      },
      [
        viewYear,
        viewMonth,
      ],
    )

  // ==============================
  // 다이어리 메모
  // ==============================

  const memoMap =
    useMemo(
      () => {
        const map:
          Record<
            string,
            string
          > =
          {}

        for (
          const diary
          of diaries
        ) {
          map[
            diary.date
          ] =
            diary.content
        }

        return map
      },
      [
        diaries,
      ],
    )

  // ==============================
  // 일정
  // ==============================

  const scheduleMap =
    useMemo(
      () => {
        const map =
          new Map<
            string,
            Schedule[]
          >()

        for (
          const schedule
          of schedules
        ) {
          const current =
            map.get(
              schedule.date,
            ) ??
            []

          map.set(
            schedule.date,
            [
              ...current,
              schedule,
            ],
          )
        }

        return map
      },
      [
        schedules,
      ],
    )

  // ==============================
  // 생리 기간
  // ==============================

  const periodSet =
    useMemo(
      () =>
        expandPeriods(
          periods,
        ),
      [
        periods,
      ],
    )

  // ==============================
  // 월 선택창
  // ==============================

  const togglePicker =
    () => {
      setPickerYear(
        viewYear,
      )

      setPickerOpen(
        (
          open,
        ) =>
          !open,
      )
    }

  const pickMonth =
    (
      monthIndex:
        number,
    ) => {
      setViewYear(
        pickerYear,
      )

      setViewMonth(
        monthIndex,
      )

      setPickerOpen(
        false,
      )
    }

  // ==============================
  // 이전 달
  // ==============================

  const prevMonth =
    () => {
      setPickerOpen(
        false,
      )

      if (
        viewMonth ===
        0
      ) {
        setViewYear(
          (
            year,
          ) =>
            year - 1,
        )

        setViewMonth(
          11,
        )
      } else {
        setViewMonth(
          (
            month,
          ) =>
            month - 1,
        )
      }
    }

  // ==============================
  // 다음 달
  // ==============================

  const nextMonth =
    () => {
      setPickerOpen(
        false,
      )

      if (
        viewMonth ===
        11
      ) {
        setViewYear(
          (
            year,
          ) =>
            year + 1,
        )

        setViewMonth(
          0,
        )
      } else {
        setViewMonth(
          (
            month,
          ) =>
            month + 1,
        )
      }
    }

  // ==============================
  // 날짜 시트 열기
  // ==============================

  const openSheetFor =
    (
      key: string,
    ) => {
      setSelectedDate(
        key,
      )

      setFabOpen(
        false,
      )

      setSheetOpen(
        true,
      )
    }

  // ==============================
  // 일정 추가
  // ==============================

  const handleAdd =
    async (
      schedule:
        Omit<
          Schedule,
          | 'id'
          | 'createdAt'
          | 'updatedAt'
        >,
    ) => {
      try {
        const created =
          await addSchedule(
            schedule,
          )

        setSchedules(
          (
            prev,
          ) => [
            ...prev,
            created,
          ],
        )
      } catch (error) {
        console.error(
          '일정을 추가하지 못했습니다.',
          error,
        )
      }
    }

  // ==============================
  // 일정 삭제
  // ==============================

  const handleDelete =
    async (
      id: string,
    ) => {
      try {
        await deleteSchedule(
          id,
        )

        setSchedules(
          (
            prev,
          ) =>
            prev.filter(
              (
                schedule,
              ) =>
                schedule.id !==
                id,
            ),
        )
      } catch (error) {
        console.error(
          '일정을 삭제하지 못했습니다.',
          error,
        )
      }
    }

  // ==============================
  // 생리 기록 모드
  // ==============================

  const togglePeriodMode =
    () => {
      setPeriodMode(
        (
          current,
        ) =>
          !current,
      )

      setPendingStart(
        null,
      )

      setFabOpen(
        false,
      )
    }

  // ==============================
  // 생리 시작일 / 종료일
  // ==============================

  const handlePeriodPick =
    async (
      key: string,
    ) => {
      try {
        if (
          pendingStart ===
          null
        ) {
          const existing =
            periodContaining(
              periods,
              key,
            )

          if (
            existing
          ) {
            const next =
              periods.filter(
                (
                  period,
                ) =>
                  period !==
                  existing,
              )

            await savePeriods(
              next,
            )

            setPeriods(
              next,
            )

            setPeriodMode(
              false,
            )

            return
          }

          setPendingStart(
            key,
          )

          return
        }

        const [
          start,
          end,
        ] =
          pendingStart <=
          key
            ? [
                pendingStart,
                key,
              ]
            : [
                key,
                pendingStart,
              ]

        const next = [
          ...periods,
          {
            start,
            end,
          },
        ]

        await savePeriods(
          next,
        )

        setPeriods(
          next,
        )

        setPendingStart(
          null,
        )

        setPeriodMode(
          false,
        )
      } catch (error) {
        console.error(
          '생리 기록을 저장하지 못했습니다.',
          error,
        )
      }
    }

  // ==============================
  // 날짜 클릭
  // ==============================

  const onDateClick =
    (
      key: string,
    ) => {
      setSelectedDate(
        key,
      )

      if (
        periodMode
      ) {
        void handlePeriodPick(
          key,
        )

        return
      }

      openSheetFor(
        key,
      )
    }

  return (
    <div className="relative min-h-[calc(100dvh-64px)] bg-white">

      <CalendarHeader
        viewYear={
          viewYear
        }
        viewMonth={
          viewMonth
        }
        pickerOpen={
          pickerOpen
        }
        pickerYear={
          pickerYear
        }
        onBack={() =>
          navigate(-1)
        }
        onTogglePicker={
          togglePicker
        }
        onPrevYear={() =>
          setPickerYear(
            (
              year,
            ) =>
              year - 1,
          )
        }
        onNextYear={() =>
          setPickerYear(
            (
              year,
            ) =>
              year + 1,
          )
        }
        onPickMonth={
          pickMonth
        }
        onOpenWeekly={() =>
          navigate(
            '/weeklyCalendar',
            {
              state: {
                selectedDate,
              },
            },
          )
        }
        onPrevMonth={
          prevMonth
        }
        onNextMonth={
          nextMonth
        }
      />

      {/* 생리 기록 선택 안내 */}
      {periodMode && (
        <div className="flex items-center justify-between px-6 pt-3">

          <span className="text-[11px] font-medium text-[#C99A00]">
            {pendingStart
              ? '종료일을 선택하세요'
              : '시작일을 선택하세요'}
          </span>

          <button
            type="button"
            onClick={
              togglePeriodMode
            }
            className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-[10px] font-semibold text-gray-500"
          >
            취소
          </button>

        </div>
      )}

      <CalendarGrid
        cells={
          cells
        }
        viewYear={
          viewYear
        }
        viewMonth={
          viewMonth
        }
        todayKey={
          todayKey
        }
        memoMap={
          memoMap
        }
        scheduleMap={
          scheduleMap
        }
        periodSet={
          periodSet
        }
        pendingStart={
          pendingStart
        }
        toKey={
          toKey
        }
        onDateClick={
          onDateClick
        }
      />

      {/* 날짜 상세 / 일정 추가 */}
      <ScheduleSheet
        open={
          sheetOpen
        }
        onClose={() =>
          setSheetOpen(
            false,
          )
        }
        dateKey={
          selectedDate
        }
        items={
          scheduleMap.get(
            selectedDate,
          ) ??
          []
        }
        periods={
          periods
        }
        onAdd={
          handleAdd
        }
        onDelete={
          handleDelete
        }
        onRecordPeriod={() => {
          setSheetOpen(
            false,
          )

          setPeriodMode(
            true,
          )

          setPendingStart(
            null,
          )
        }}
      />

      {/* 일정 시트가 닫혀 있을 때만 FAB */}
      {!sheetOpen && (
        <>

          {fabOpen && (
            <>

              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() =>
                  setFabOpen(
                    false,
                  )
                }
                className="absolute inset-0 z-20 bg-black/45"
              />

              <div className="absolute bottom-24 right-5 z-30 flex flex-col items-end gap-4">

                {/* 생리 기록 */}
                <button
                  type="button"
                  onClick={() => {
                    setFabOpen(
                      false,
                    )

                    setPeriodMode(
                      true,
                    )

                    setPendingStart(
                      null,
                    )
                  }}
                  className="flex items-center gap-3"
                >

                  <span className="text-[12px] font-medium text-white drop-shadow">
                    생리기록 추가하기
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">

                    <img
                      src={
                        logoUrl
                      }
                      alt="BLOOM"
                      className="h-6 w-6"
                    />

                  </span>

                </button>

                {/* 일정 추가 */}
                <button
                  type="button"
                  onClick={() => {
                    setFabOpen(
                      false,
                    )

                    openSheetFor(
                      selectedDate,
                    )
                  }}
                  className="flex items-center gap-3"
                >

                  <span className="text-[12px] font-medium text-white drop-shadow">
                    일정추가 하기
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-[#31C66B]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={
                        2
                      }
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>

                  </span>

                </button>

              </div>

            </>
          )}

          {/* 우측 하단 + */}
          <button
            type="button"
            onClick={() =>
              setFabOpen(
                (
                  open,
                ) =>
                  !open,
              )
            }
            aria-label={
              fabOpen
                ? '닫기'
                : '추가'
            }
            className="absolute bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#31C66B] text-white shadow-lg transition-transform"
          >

            <svg
              viewBox="0 0 24 24"
              className={
                'h-7 w-7 transition-transform ' +
                (
                  fabOpen
                    ? 'rotate-45'
                    : ''
                )
              }
              fill="none"
              stroke="currentColor"
              strokeWidth={
                2
              }
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>

          </button>

        </>
      )}

    </div>
  )
}