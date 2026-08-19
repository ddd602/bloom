import { useEffect, useState } from 'react'

import {
  EXERCISE_CATEGORIES,
  EQUIPMENTS,
  EXERCISES,
} from '../types/exercisesData'

import { IconChevronLeft } from '../icons'

type Props = {
  open: boolean
  initialSelected: string[]
  onClose: () => void
  onConfirm: (names: string[]) => void
}

function ExercisePicker({
  open,
  initialSelected,
  onClose,
  onConfirm,
}: Props) {
  const [category, setCategory] = useState(EXERCISE_CATEGORIES[0])
  const [equipment, setEquipment] = useState('전체')
  const [selected, setSelected] = useState<string[]>(initialSelected)

  useEffect(() => {
    if (open) {
      setSelected(initialSelected)
      setCategory(EXERCISE_CATEGORIES[0])
      setEquipment('전체')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  const list = EXERCISES.filter(
    (e) =>
      e.category === category &&
      (equipment === '전체' || e.equipment === equipment),
  )

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name],
    )
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[390px] -translate-x-1/2 flex-col bg-white">
      {/* 헤더 */}
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
            운동 선택하기
          </h1>
        </div>
      </header>

      {/* 카테고리 */}
      <div className="pt-7">
        <div className="px-6">
          <h2 className="text-[14px] font-bold text-gray-900">
            운동 카테고리
          </h2>

          <p className="mt-1 text-[9px] text-gray-400">
            원하는 운동 부위를 선택해주세요
          </p>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto px-6 pb-1">
          {EXERCISE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                'shrink-0 rounded-full px-4 py-2 text-[11px] transition-colors ' +
                (c === category
                  ? 'bg-[#31C66B] font-semibold text-white'
                  : 'bg-[#F5F5F5] text-gray-500')
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 기구 */}
      <div className="mt-5 border-b border-gray-100">
        <div className="flex gap-5 overflow-x-auto px-6 pb-3">
          {EQUIPMENTS.map((eq) => (
            <button
              key={eq}
              type="button"
              onClick={() => setEquipment(eq)}
              className={
                'relative shrink-0 pb-1 text-[11px] transition-colors ' +
                (eq === equipment
                  ? 'font-bold text-[#31C66B]'
                  : 'text-gray-400')
              }
            >
              {eq}

              {eq === equipment && (
                <span className="absolute inset-x-0 -bottom-[13px] h-[2px] rounded-full bg-[#31C66B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {list.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-[5px] bg-[#F8F8F8]">
            <p className="text-[11px] text-gray-400">
              해당 조건의 운동이 없어요
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((e) => {
              const on = selected.includes(e.name)

              return (
                <li key={e.name}>
                  <button
                    type="button"
                    onClick={() => toggle(e.name)}
                    className={
                      'flex w-full items-center justify-between rounded-[5px] border px-4 py-4 text-left transition-colors ' +
                      (on
                        ? 'border-[#31C66B] bg-[#F1FFF6]'
                        : 'border-gray-100 bg-[#FAFAFA]')
                    }
                  >
                    <div>
                      <p
                        className={
                          'text-[12px] font-bold ' +
                          (on
                            ? 'text-[#31C66B]'
                            : 'text-gray-900')
                        }
                      >
                        {e.name}
                      </p>

                      <p className="mt-1 text-[9px] text-gray-400">
                        {e.category} · {e.equipment}
                      </p>
                    </div>

                    <div
                      className={
                        'flex h-5 w-5 items-center justify-center rounded-full border ' +
                        (on
                          ? 'border-[#31C66B] bg-[#31C66B]'
                          : 'border-gray-300 bg-white')
                      }
                    >
                      {on && (
                        <span className="text-[10px] font-bold text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* 담기 버튼 */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-6 pb-6 pt-4">
        <button
          type="button"
          onClick={() => onConfirm(selected)}
          disabled={selected.length === 0}
          className={
            'w-full rounded-full py-3.5 text-[15px] font-bold transition-colors ' +
            (selected.length > 0
              ? 'bg-[#31C66B] text-white active:bg-[#29B760]'
              : 'cursor-not-allowed bg-gray-200 text-gray-400')
          }
        >
          {selected.length}개 담겼어요
        </button>
      </div>
    </div>
  )
}

export default ExercisePicker