import { useEffect, useRef, useState } from 'react'

// 서버가 주는 ISO 타임스탬프(초 이하 자리 포함)를
// "날짜 시:분"만 보이게 정리
function formatHistoryDate(raw: string) {
  const date = new Date(raw)

  if (Number.isNaN(date.getTime())) {
    return raw
  }

  const pad = (n: number) =>
    String(n).padStart(2, '0')

  return (
    `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

// 카테고리 탭
const CATEGORIES = ['전체', '운동', '식단', '시술', '관리', '기타'] as const
type Category = (typeof CATEGORIES)[number]

export type HistoryItem = {
  id: string
  category: Exclude<Category, '전체'>
  title: string
  date: string
}

type Props = {
  open: boolean
  onClose: () => void
  items: HistoryItem[]
  onSelect: (id: string) => void
  onNew?: () => void
}

function HistorySheet({
  open,
  onClose,
  items: allItems,
  onSelect,
  onNew,
}: Props) {
  const [tab, setTab] = useState<Category>('전체')
  const [offset, setOffset] = useState(0)
  const [current, setCurrent] = useState(0)
  const [dragging, setDragging] = useState(false)

  const startY = useRef<number | null>(null)
  const startOffset = useRef(0)
  const currentRef = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // 열릴 때마다 완전히 펼친 상태로 초기화
  useEffect(() => {
    if (open) {
      setOffset(0)
      setCurrent(0)
      currentRef.current = 0
    }
  }, [open])

  const onPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    startY.current = e.clientY
    startOffset.current = offset
    setDragging(true)
  }

  const onPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (startY.current === null) return

    const height =
      sheetRef.current?.offsetHeight ?? 400

    const dy =
      e.clientY - startY.current

    const next = Math.min(
      Math.max(
        startOffset.current + dy,
        0,
      ),
      height,
    )

    currentRef.current = next
    setCurrent(next)
  }

  const endDrag = () => {
    if (startY.current === null) return

    const height =
      sheetRef.current?.offsetHeight ?? 400

    const resting =
      currentRef.current

    // 90% 이상 아래로 내렸을 때 닫기
    if (resting > height * 0.9) {
      onClose()
    } else {
      setOffset(resting)
    }

    setDragging(false)
    startY.current = null
  }

  if (!open) return null

  const translateY =
    dragging ? current : offset

  // 카테고리별 필터링
  const items =
    tab === '전체'
      ? allItems
      : allItems.filter(
          (it) => it.category === tab,
        )

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">

      {/* 뒤 어두운 배경 */}
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/25"
      />

      {/* 바텀 시트 */}
      <div
        ref={sheetRef}
        className="
          relative
          flex
          max-h-[72%]
          flex-col
          overflow-hidden
          rounded-t-[5px]
          bg-[#F8F8F8]
          pb-5
          shadow-2xl
        "
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging
            ? 'none'
            : 'transform 0.2s ease',
        }}
      >
        {/* 드래그 영역 */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          {/* 손잡이 */}
          <div className="pt-3">
            <div className="mx-auto h-[3px] w-10 rounded-full bg-gray-300" />
          </div>

          {/* 제목 + 새 대화 버튼 */}
          <div className="flex items-center justify-between px-5 pb-4 pt-4">

            <div>
              <h2 className="text-[17px] font-bold text-gray-900">
                이전 대화 내용
              </h2>

              <p className="mt-1 text-[9px] text-gray-400">
                저장된 대화를 다시 확인해보세요
              </p>
            </div>

            {onNew && (
              <button
                type="button"

                // 새 대화 버튼을 누를 때
                // 바텀시트 드래그가 시작되지 않도록 막음
                onPointerDown={(e) => {
                  e.stopPropagation()
                }}

                onClick={(e) => {
                  e.stopPropagation()
                  onNew()
                }}

                className="
                  rounded-full
                  bg-[#31C66B]
                  px-3
                  py-1.5
                  text-[10px]
                  font-semibold
                  text-white
                  active:bg-[#29B760]
                "
              >
                + 새 대화
              </button>
            )}

          </div>

          {/* 카테고리 */}
          <div className="border-b border-gray-200 px-5">
            <div className="flex gap-5 overflow-x-auto pb-2">

              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"

                  // 카테고리 버튼을 눌렀을 때
                  // 드래그 시작 방지
                  onPointerDown={(e) => {
                    e.stopPropagation()
                  }}

                  onClick={(e) => {
                    e.stopPropagation()
                    setTab(c)
                  }}

                  className={
                    'shrink-0 text-[11px] transition-colors ' +
                    (
                      tab === c
                        ? 'font-bold text-[#31C66B]'
                        : 'text-gray-400'
                    )
                  }
                >
                  {c}
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* 대화 목록 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">

          {items.length === 0 ? (

            <div className="flex h-40 items-center justify-center">
              <p className="text-[11px] text-gray-400">
                저장된 대화가 없어요.
              </p>
            </div>

          ) : (

            <ul className="space-y-2.5">

              {items.map((it) => (

                <li key={it.id}>

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(it.id)
                    }
                    className="
                      flex
                      w-full
                      items-start
                      justify-between
                      rounded-[5px]
                      bg-white
                      px-4
                      py-3
                      text-left
                      shadow-sm
                      transition-colors
                      active:bg-[#F1FFF6]
                    "
                  >

                    {/* 왼쪽 */}
                    <div className="min-w-0 pr-3">

                      <div className="mb-1 flex items-center gap-2">

                        <span
                          className="
                            rounded-full
                            bg-[#EAF8EC]
                            px-2
                            py-0.5
                            text-[8px]
                            font-medium
                            text-[#20B970]
                          "
                        >
                          {it.category}
                        </span>

                      </div>

                      <p className="truncate text-[12px] font-semibold text-gray-900">
                        {it.title}
                      </p>

                    </div>

                    {/* 오른쪽 */}
                    <div className="flex shrink-0 flex-col items-end gap-1">

                      <span className="text-[10px] text-gray-400">
                        {formatHistoryDate(it.date)}
                      </span>

                      <span className="text-[16px] leading-none text-gray-300">
                        ›
                      </span>

                    </div>

                  </button>

                </li>

              ))}

            </ul>

          )}

        </div>
      </div>
    </div>
  )
}

export default HistorySheet