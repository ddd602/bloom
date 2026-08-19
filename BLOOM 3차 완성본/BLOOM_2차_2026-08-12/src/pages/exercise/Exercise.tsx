import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DailyExerciseRecord from '../../components/Manage/DailyExerciseRecord'
import RoutineCard from '../../components/Manage/RoutineCard'
import ScreenHeader from '../../components/ScreenHeader'
import { useExercise } from '../../components/context/ExerciseContext'
import { IconPencil } from '../../components/icons'
import type { Routine } from '../../components/types/routines'

function Exercise() {
  const navigate = useNavigate()
  const { routines, startRoutine, removeRoutine } = useExercise()
  const [editing, setEditing] = useState(false)

  const select = (r: Routine) => {
    if (editing) return

    startRoutine(r)
    navigate('/manage/exercise/timer')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader
        title="운동하기"
        onBack={() => navigate('/manage')}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-7">
        <DailyExerciseRecord />

        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-gray-900">
                운동 루틴 선택하기
              </h2>

              <p className="mt-1 text-[9px] text-gray-400">
                원하는 운동 루틴을 선택해 바로 시작해보세요
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              aria-label="루틴 편집"
              className="flex h-7 min-w-7 items-center justify-center text-gray-400"
            >
              {editing ? (
                <span className="text-[11px] font-bold text-gray-700">
                  완료
                </span>
              ) : (
                <IconPencil className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {routines.map((r) => (
              <div key={r.id} className="flex items-center gap-2">
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`'${r.name}' 루틴을 삭제할까요?`)) {
                        removeRoutine(r.id)
                      }
                    }}
                    aria-label={`${r.name} 삭제`}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[13px] leading-none text-white"
                  >
                    −
                  </button>
                )}

                <div className="min-w-0 flex-1">
                  <RoutineCard
                    routine={r}
                    onClick={editing ? undefined : () => select(r)}
                  />
                </div>
              </div>
            ))}

            {routines.length === 0 && (
              <div className="flex h-[72px] items-center justify-center rounded-[5px] bg-[#FAFAFA] text-[10px] text-gray-400">
                루틴이 없어요. 새로 만들어보세요.
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/manage/exercise/new')}
              className="flex h-[52px] w-full items-center justify-center rounded-lg border border-[#42DB83] bg-[#F0FBF4] text-[11px] text-gray-500"
            >
              <span className="mr-2 text-xl font-light text-gray-400">
                +
              </span>
              새 운동루틴 만들기
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Exercise