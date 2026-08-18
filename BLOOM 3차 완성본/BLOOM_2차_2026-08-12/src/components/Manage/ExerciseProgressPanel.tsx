import { useRef, useState } from 'react'
import RoutineCard from './RoutineCard'
import { useExercise } from '../context/ExerciseContext'

type Props = {
  remainingLabel: string
  onAddRoutine: () => void
}

const PEEK = 96

function ExerciseProgressPanel({
  remainingLabel,
  onAddRoutine,
}: Props) {
  const {
    activeRoutine,
    upcomingRoutines,
    sessionCompleted,
  } = useExercise()

  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const startY = useRef<number | null>(null)
  const startOffset = useRef(0)
  const currentOffset = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  const getMaxOffset = () => {
    const height = sheetRef.current?.offsetHeight ?? 500
    return Math.max(0, height - PEEK)
  }

  const onPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    startY.current = e.clientY
    startOffset.current = offset
    currentOffset.current = offset

    setDragging(true)

    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (startY.current === null) return

    const dy = e.clientY - startY.current

    const next = Math.min(
      Math.max(startOffset.current + dy, 0),
      getMaxOffset(),
    )

    currentOffset.current = next
    setOffset(next)
  }

  const endDrag = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (startY.current === null) return

    startY.current = null
    setDragging(false)

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      ref={sheetRef}
      className="absolute inset-x-0 bottom-0 top-[315px] flex flex-col rounded-t-[24px] bg-[#FCFCFC] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      style={{
        transform: `translateY(${offset}px)`,
        transition: dragging
          ? 'none'
          : 'transform 0.15s ease-out',
      }}
    >
      {/* 드래그 손잡이 */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="shrink-0 cursor-grab touch-none pb-3 pt-3 active:cursor-grabbing"
      >
        <div className="mx-auto h-[4px] w-10 rounded-full bg-[#CDD3D8]" />
      </div>

      {/* 내용 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        {/* 현재 진행중인 루틴 */}
        <section>
          <p className="mb-3 text-[12px] font-bold text-gray-900">
            현재 진행중인 루틴
          </p>

          {activeRoutine ? (
            <RoutineCard
              routine={activeRoutine}
              rightTop={remainingLabel}
            />
          ) : (
            <p className="text-[11px] text-gray-400">
              진행중인 루틴이 없어요
            </p>
          )}
        </section>

        {/* 진행 예정인 루틴 */}
        <section className="mt-6">
          <p className="mb-3 text-[12px] font-bold text-gray-900">
            진행 예정인 루틴
          </p>

          <div className="space-y-2">
            {upcomingRoutines.map((r, i) => (
              <RoutineCard
                key={`${r.id}-${i}`}
                routine={r}
              />
            ))}

            <button
              type="button"
              onClick={onAddRoutine}
              className="flex h-[54px] w-full items-center justify-center rounded-lg border border-[#31C66B] bg-[#F1FFF6] text-[11px] font-medium text-gray-500 transition-colors active:bg-[#E7F8ED]"
            >
              <span className="mr-2 text-[20px] font-light text-gray-400">
                +
              </span>

              운동 루틴 추가하러 가기
            </button>
          </div>
        </section>

        {/* 진행 완료된 루틴 */}
        <section className="mt-6">
          <p className="mb-3 text-[12px] font-bold text-gray-900">
            진행 완료된 루틴
          </p>

          {sessionCompleted.length === 0 ? (
            <p className="text-[11px] text-gray-400">
              아직 완료한 루틴이 없어요
            </p>
          ) : (
            <div className="space-y-2">
              {sessionCompleted.map((r, i) => (
                <RoutineCard
                  key={`${r.id}-${i}`}
                  routine={r}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ExerciseProgressPanel