// CalendarGrid.tsx

import type { Schedule } from '../api/ScheduleApi'

const WEEKDAYS = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
]

type Props = {
  cells: (number | null)[]
  viewYear: number
  viewMonth: number
  todayKey: string
  memoMap: Record<string, string>
  scheduleMap: Map<string, Schedule[]>
  periodSet: Set<string>
  pendingStart: string | null
  toKey: (year: number, month: number, day: number) => string
  onDateClick: (key: string) => void
}

export default function CalendarGrid({
  cells,
  viewYear,
  viewMonth,
  todayKey,
  memoMap,
  scheduleMap,
  periodSet,
  pendingStart,
  toKey,
  onDateClick,
}: Props) {
  return (
    <>
      <div className="mb-[20px] mt-[48px] grid grid-cols-7 px-5 text-center text-[11px] text-gray-900">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-[30px] px-5">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={i} className="relative h-[62px]" />
          }

          const key = toKey(viewYear, viewMonth, day)
          const isToday = key === todayKey
          const memo = memoMap[key]

          const daySchedules = scheduleMap.get(key)
          const hasSchedule =
            !!daySchedules && daySchedules.length > 0

          const isPeriod =
            periodSet.has(key) ||
            key === pendingStart

          // 같은 주 안에서 이전/다음 날짜가
          // 생리 기간인지 확인
          const rowCol = i % 7

          const prevDay =
            rowCol > 0
              ? cells[i - 1]
              : null

          const nextDay =
            rowCol < 6
              ? cells[i + 1]
              : null

          const prevIsPeriod =
            prevDay !== null &&
            periodSet.has(
              toKey(
                viewYear,
                viewMonth,
                prevDay,
              ),
            )

          const nextIsPeriod =
            nextDay !== null &&
            periodSet.has(
              toKey(
                viewYear,
                viewMonth,
                nextDay,
              ),
            )

          // 앞뒤에 생리 기간이 없을 때만
          // 해당 방향을 둥글게 처리
          const periodBandClass =
            (prevIsPeriod
              ? ''
              : 'rounded-l-full') +
            ' ' +
            (nextIsPeriod
              ? ''
              : 'rounded-r-full')

          return (
            <div
              key={i}
              onClick={() => onDateClick(key)}
              className="relative flex h-[62px] cursor-pointer flex-col items-center"
            >
              {/* 생리주기 노란 밴드 */}
              {isPeriod && (
                <div
                  className={
                    'absolute left-0 right-0 top-0 h-[25px] bg-[#FFF4A3] ' +
                    periodBandClass
                  }
                />
              )}

              {/* 날짜 */}
              <span
                className={
                  'relative z-10 flex h-[25px] w-[25px] items-center justify-center rounded-full text-[14px] ' +
                  (isToday
                    ? 'bg-[#32DE8B] font-bold text-white'
                    : 'font-normal text-gray-400')
                }
              >
                {day}
              </span>

              {/* 일정 */}
              {hasSchedule && (
                <span className="relative z-10 mt-1 max-w-[44px] text-center text-[7px] leading-[8px] text-gray-500">
                  <span className="block">
                    {daySchedules[0].title}
                  </span>

                  {daySchedules.length > 1 && (
                    <span className="block">
                      외 {daySchedules.length - 1}건
                    </span>
                  )}
                </span>
              )}

              {/* 일정이 없을 때 다이어리 메모 */}
              {!hasSchedule && memo && (
                <span className="relative z-10 mt-1 max-w-[44px] text-center text-[7px] leading-[8px] text-gray-500">
                  {memo}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}