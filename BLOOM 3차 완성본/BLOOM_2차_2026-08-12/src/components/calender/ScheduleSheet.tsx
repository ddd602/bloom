import { useEffect, useRef, useState } from 'react'

import {
  formatKoreanDate,
  type Schedule,
} from '../api/ScheduleApi'

import type { Period } from '../api/PeriodApi'

import {
  periodStatus,
  type PeriodTone,
} from './periodUtils'

type Props = {
  open: boolean
  onClose: () => void
  dateKey: string
  items: Schedule[] // 해당 날짜의 일정들
  periods: Period[]
  onAdd: (s: Omit<Schedule, 'id'>) => void
  onDelete: (id: string) => void
  onRecordPeriod: () => void
}

// 단계별 색상
const TAG_CLASS: Record<PeriodTone, string> = {
  green: 'bg-[#32C878] text-white',
  yellow: 'bg-[#FCE7A6] text-[#B7860B]',
  gray: 'bg-gray-200 text-gray-600',
}
const CARD_CLASS: Record<PeriodTone, string> = {
  green: 'bg-[#EAF8EF]',
  yellow: 'bg-[#FDF6E3]',
  gray: 'bg-gray-50',
}

export default function ScheduleSheet({
  open,
  onClose,
  dateKey,
  items,
  periods,
  onAdd,
  onDelete,
  onRecordPeriod,
}: Props) {
  const status = periodStatus(dateKey, periods)
  // 드래그 (내린 위치에 머무름, 끝까지 내리면 닫힘)
  const [offset, setOffset] = useState(0)
  const [current, setCurrent] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef<number | null>(null)
  const startOffset = useRef(0)
  const currentRef = useRef(0)
  const collapsedRef = useRef(0) // 처음 열렸을 때 머무는(peek) 위치
  const sheetRef = useRef<HTMLDivElement>(null)

  // 추가 폼
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [place, setPlace] = useState('')
  const [time, setTime] = useState('')

  // 처음 열릴 때: 일부만 보이도록(peek) 내려두고, 위로 드래그하면 펼쳐짐
  const COLLAPSED_VISIBLE = 360 // 접었을 때 보이는 높이(px)
  useEffect(() => {
    if (open) {
      const h = sheetRef.current?.offsetHeight ?? 0
      const collapsed = Math.max(0, h - COLLAPSED_VISIBLE)
      collapsedRef.current = collapsed
      setOffset(collapsed)
      setCurrent(collapsed)
      currentRef.current = collapsed
      setAdding(false)
      setTitle('')
      setPlace('')
      setTime('')
    }
  }, [open, dateKey])

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY
    startOffset.current = offset
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current === null) return
    const height = sheetRef.current?.offsetHeight ?? 400
    const dy = e.clientY - startY.current
    const next = Math.min(Math.max(startOffset.current + dy, 0), height)
    currentRef.current = next
    setCurrent(next)
  }
  const endDrag = () => {
    if (startY.current === null) return
    const collapsed = collapsedRef.current
    const pos = currentRef.current
    // 아래로 충분히 내리면 닫힘 / 위로 올리면 완전히 펼침 / 중간이면 peek
    if (pos > collapsed + 100) onClose()
    else if (pos < collapsed / 2) setOffset(0)
    else setOffset(collapsed)
    setDragging(false)
    startY.current = null
  }

  const submit = () => {
    if (!title.trim()) return
    onAdd({ date: dateKey, title: title.trim(), place: place.trim(), time })
    setAdding(false)
    setTitle('')
    setPlace('')
    setTime('')
  }

  if (!open) return null

  const translateY = dragging ? current : offset

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      {/* 배경 */}
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* 시트 */}
      <div
        ref={sheetRef}
        className="relative flex h-[82%] flex-col rounded-t-[5px] bg-white pb-5 shadow-2xl"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: dragging ? 'none' : 'transform 0.2s ease',
        }}
      >
        {/* 드래그 손잡이 */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="cursor-grab touch-none pt-3 active:cursor-grabbing"
        >
          <div className="mx-auto h-1 w-10 rounded-full bg-gray-300" />
          <div className="px-5 pb-1 pt-4">
            <p className="text-sm text-gray-500">세부 일정</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {formatKoreanDate(dateKey)}
              </h2>
              {status && (
                <span
                  className={
                    'rounded-full px-2.5 py-0.5 text-xs font-bold ' +
                    TAG_CLASS[status.tone]
                  }
                >
                  {status.phase}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 타임라인 목록 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2">
          <ul>
            {items.map((s) => (
              <li key={s.id} className="flex gap-3">
                {/* 타임라인 점/선 */}
                <div className="flex flex-col items-center">
                  <span className="mt-4 h-3 w-3 shrink-0 rounded-full bg-green-500" />
                  <span className="w-px flex-1 bg-gray-200" />
                </div>
                {/* 카드 */}
                <div className="mb-3 flex-1">
                  <div className="flex items-start justify-between rounded-[5px] border border-green-400 bg-green-50 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900">
                        {s.title}
                      </p>
                      {s.place && (
                        <p className="mt-0.5 text-xs text-gray-500">{s.place}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2 pl-2">
                      {s.time && (
                        <span className="text-xs text-gray-500">{s.time}</span>
                      )}
                      <button
                        onClick={() => onDelete(s.id)}
                        aria-label="일정 삭제"
                        className="text-gray-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}

            {/* 추가 슬롯 */}
            <li className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-4 h-3 w-3 shrink-0 rounded-full border-2 border-gray-300 bg-white" />
              </div>
              <div className="mb-3 flex-1">
                {adding ? (
                  <div className="space-y-2 rounded-[5px] border border-gray-200 bg-gray-50 p-3">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="일정 제목 (예: 지방 분해 주사 시술)"
                      className="w-full rounded-[5px] border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="장소 (예: 톤즈의원 강남점)"
                      className="w-full rounded-[5px] border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-[5px] border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setAdding(false)}
                        className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-500"
                      >
                        취소
                      </button>
                      <button
                        onClick={submit}
                        className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-semibold text-white"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    aria-label="일정 추가"
                    className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-2xl text-gray-400"
                  >
                    +
                  </button>
                )}
              </div>
            </li>
          </ul>

          {/* 생리 기록 */}
          <div className="mt-4 pb-4">
            <h3 className="mb-2 text-base font-bold text-gray-900">생리 기록</h3>
            <button
              onClick={onRecordPeriod}
              className={
                'flex w-full items-center justify-between rounded-[5px] p-4 text-left ' +
                (status ? CARD_CLASS[status.tone] : 'bg-gray-50')
              }
            >
              {status ? (
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={
                      'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ' +
                      TAG_CLASS[status.tone]
                    }
                  >
                    {status.phase}
                    {status.phase === '생리중' && status.dayInPeriod
                      ? ` ${status.dayInPeriod}일차`
                      : ''}
                  </span>
                  {status.daysUntilNext != null && status.daysUntilNext > 0 ? (
                    <span className="truncate text-sm text-gray-700">
                      예정일까지{' '}
                      <b className="text-[#32C878]">{status.daysUntilNext}일</b>
                    </span>
                  ) : status.message ? (
                    <span className="truncate text-[11px] text-gray-400">
                      {status.message}
                    </span>
                  ) : null}
                </div>
              ) : (
                <span className="text-sm text-gray-500">
                  생리 기록을 추가해보세요
                </span>
              )}
              <span className="shrink-0 pl-2 text-gray-300">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
