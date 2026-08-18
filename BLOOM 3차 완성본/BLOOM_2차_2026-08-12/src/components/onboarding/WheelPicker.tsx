import {
  useEffect,
  useRef,
  useState,
} from 'react'

const ITEM = 44

type Props = {
  values: (string | number)[]
  value: string | number
  onChange: (v: string | number) => void
  unit?: string
  active?: boolean

  // 날짜 입력처럼 한 줄만 보일 때
  compact?: boolean
}

export default function WheelPicker({
  values,
  value,
  onChange,
  unit,
  active,
  compact = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const [center, setCenter] = useState(() =>
    Math.max(0, values.indexOf(value)),
  )

  const settle =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const skip = useRef(true)

  useEffect(() => {
    const index = Math.max(
      0,
      values.indexOf(value),
    )

    if (ref.current) {
      ref.current.scrollTop =
        index * ITEM
    }

    setCenter(index)

    const timer = setTimeout(() => {
      skip.current = false
    }, 250)

    return () => {
      clearTimeout(timer)

      if (settle.current) {
        clearTimeout(settle.current)
      }
    }
    // 최초 위치 설정
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    const element = ref.current

    if (!element) return

    const index = Math.min(
      values.length - 1,
      Math.max(
        0,
        Math.round(
          element.scrollTop / ITEM,
        ),
      ),
    )

    setCenter(index)

    if (skip.current) return

    if (settle.current) {
      clearTimeout(settle.current)
    }

    settle.current = setTimeout(() => {
      onChange(values[index])
    }, 100)
  }

  // =============================
  // 날짜용 한 줄 picker
  // =============================

  if (compact) {
    return (
      <div className="relative h-[44px] w-full overflow-hidden">
        {/* WebKit 스크롤바 제거 */}
        <style>
          {`
            [data-wheel-picker]::-webkit-scrollbar {
              display: none;
              width: 0;
              height: 0;
            }
          `}
        </style>

        <div
          ref={ref}
          data-wheel-picker
          onScroll={handleScroll}
          className="
            relative
            h-[44px]
            w-full
            snap-y
            snap-mandatory
            overflow-y-auto
            overscroll-contain
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {values.map((item, index) => (
            <div
              key={item}
              className="
                flex
                h-[44px]
                snap-center
                items-center
                justify-center
              "
            >
              <span
                className={
                  index === center
                    ? active
                      ? 'text-[13px] font-semibold text-[#31C66B]'
                      : 'text-[13px] font-medium text-[#777]'
                    : 'text-[12px] text-transparent'
                }
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // =============================
  // 키 / 몸무게용 휠
  // =============================

  return (
    <div className="relative h-[132px] w-full overflow-hidden">
      <style>
        {`
          [data-wheel-picker]::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>

      {/* 현재 선택값 배경 */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-1
          top-1/2
          h-[44px]
          -translate-y-1/2
          rounded-[4px]
          bg-[#F1F1F1]
        "
      />

      <div
        ref={ref}
        data-wheel-picker
        onScroll={handleScroll}
        className="
          relative
          z-10
          h-full
          w-full
          snap-y
          snap-mandatory
          overflow-y-auto
          overscroll-contain
        "
        style={{
          paddingTop: ITEM,
          paddingBottom: ITEM,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {values.map((item, index) => {
          const distance =
            Math.abs(
              index - center,
            )

          let className =
            'text-[11px] text-gray-300'

          if (distance === 0) {
            className =
              'text-[18px] font-bold text-gray-900'
          } else if (distance === 1) {
            className =
              'text-[14px] text-gray-400'
          }

          return (
            <div
              key={item}
              className={`
                flex
                snap-center
                items-center
                justify-center
                ${className}
              `}
              style={{
                height: ITEM,
              }}
            >
              {item}

              {distance === 0 &&
              unit ? (
                <span className="ml-1 text-[12px] font-normal text-gray-500">
                  {unit}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}