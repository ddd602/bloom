import { useNavigate } from 'react-router-dom'

import RoutineCard from './RoutineCard'
import { useExercise } from '../context/ExerciseContext'
import { IconChevronLeft } from '../icons'
import type { Routine } from '../types/routines'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (r: Routine) => void
}

function RoutineSelectSheet({
  open,
  onClose,
  onSelect,
}: Props) {
  const navigate = useNavigate()
  const { routines } = useExercise()

  if (!open) return null

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[390px] -translate-x-1/2 flex-col bg-white">
      <header
        className="shrink-0 px-6"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-gray-900">
            루틴 추가하기
          </h1>
        </div>
      </header>

      <div className="px-6 pt-7">
        <p className="text-[14px] font-bold text-gray-900">
          운동 루틴 선택하기
        </p>

        <p className="mt-1 text-[9px] text-gray-400">
          진행 예정에 추가할 운동 루틴을 선택해주세요
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-4">
        {routines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-[11px] text-gray-400">
              만들어 둔 루틴이 없어요
            </p>

            <button
              type="button"
              onClick={() => navigate('/manage/exercise/new')}
              className="mt-4 rounded-full bg-[#31C66B] px-5 py-2.5 text-[11px] font-semibold text-white"
            >
              새 루틴 만들러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {routines.map((r) => (
              <div
                key={r.id}
                className="overflow-hidden rounded-lg border border-gray-100 bg-white"
              >
                <RoutineCard
                  routine={r}
                  onClick={() => onSelect(r)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RoutineSelectSheet