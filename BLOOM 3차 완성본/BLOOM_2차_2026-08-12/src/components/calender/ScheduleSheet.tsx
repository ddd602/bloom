// CalendarHeader.tsx

import {
  IconCalendar,
  IconChevronLeft,
  IconTriangleDown,
} from '../icons'

type Props = {
  viewYear: number
  viewMonth: number
  pickerOpen: boolean
  pickerYear: number
  onBack: () => void
  onTogglePicker: () => void
  onPrevYear: () => void
  onNextYear: () => void
  onPickMonth: (month: number) => void
  onOpenWeekly: () => void

  // 두 번째 버전에서 추가된 기능
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function CalendarHeader({
  viewYear,
  viewMonth,
  pickerOpen,
  pickerYear,
  onBack,
  onTogglePicker,
  onPrevYear,
  onNextYear,
  onPickMonth,
  onOpenWeekly,
  onPrevMonth,
  onNextMonth,
}: Props) {
  return (
    <header
      className="relative z-40 px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          {/* 뒤로가기 */}
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          {/* 이전 달 */}
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="이전 달"
            className="flex h-6 w-5 items-center justify-center text-lg text-gray-400"
          >
            ‹
          </button>

          {/* 년 / 월 선택 */}
          <button
            type="button"
            onClick={onTogglePicker}
            className="flex h-[21px] items-center gap-1 text-sm font-bold text-gray-900"
          >
            {viewYear}년 {viewMonth + 1}월

            <span
              className={
                'flex h-6 w-6 items-center justify-center text-gray-500 transition-transform ' +
                (pickerOpen ? 'rotate-180' : '')
              }
            >
              <IconTriangleDown className="h-6 w-6" />
            </span>
          </button>

          {/* 다음 달 */}
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="다음 달"
            className="flex h-6 w-5 items-center justify-center text-lg text-gray-400"
          >
            ›
          </button>

        </div>

        {/* 주간 캘린더 */}
        <button
          type="button"
          onClick={onOpenWeekly}
          aria-label="주간 캘린더로 이동"
          className="flex h-6 w-6 items-center justify-center"
        >
          <IconCalendar className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* 년 / 월 선택창 */}
      {pickerOpen && (
        <div className="absolute left-6 top-[52px] z-50 w-56 rounded-[5px] border border-gray-100 bg-white p-4 shadow-lg">

          <div className="mb-3 flex items-center justify-between">

            <button
              type="button"
              onClick={onPrevYear}
              className="px-2 text-lg text-gray-400"
            >
              ‹
            </button>

            <span className="text-base font-bold text-gray-900">
              {pickerYear}년
            </span>

            <button
              type="button"
              onClick={onNextYear}
              className="px-2 text-lg text-gray-400"
            >
              ›
            </button>

          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 12 }, (_, month) => {
              const isCurrent =
                month === viewMonth &&
                pickerYear === viewYear

              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => onPickMonth(month)}
                  className={
                    'rounded-lg py-2 text-sm ' +
                    (isCurrent
                      ? 'bg-gray-900 font-semibold text-white'
                      : 'text-gray-700 hover:bg-gray-100')
                  }
                >
                  {month + 1}월
                </button>
              )
            })}
          </div>

        </div>
      )}
    </header>
  )
}