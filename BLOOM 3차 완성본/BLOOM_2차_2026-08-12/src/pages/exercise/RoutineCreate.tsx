import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useExercise } from '../../components/context/ExerciseContext'
import ExercisePicker from '../../components/Manage/ExercisePicker'
import ScreenHeader from '../../components/ScreenHeader'
import {
  IconCheckCircle,
  IconPencil,
} from '../../components/icons'

const ROUTINE_CATEGORIES = [
  '복부',
  '어깨&팔',
  '등',
  '하체',
  '스포츠',
  '유산소',
  '기타',
]

const LEVELS = ['상', '중', '하']

function Check({ done }: { done: boolean }) {
  return done ? (
    <IconCheckCircle className="h-4 w-4 text-[#31C66B]" />
  ) : (
    <span className="h-4 w-4" />
  )
}

function RoutineCreate() {
  const navigate = useNavigate()
  const { addRoutine } = useExercise()

  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [method, setMethod] = useState<string[]>([])
  const [reps, setReps] = useState('')
  const [sets, setSets] = useState('')
  const [minutes, setMinutes] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  const min = Number(minutes) || 0
  const r = Number(reps) || 0
  const s = Number(sets) || 0

  const diffFactor =
    level === '상'
      ? 1.15
      : level === '하'
        ? 0.85
        : 1

  const estKcal =
    min > 0
      ? Math.round(min * 6 * diffFactor + r * s * 0.3)
      : 0

  const valid = name.trim() !== '' && min > 0

  const methodLabel =
    method.length === 0
      ? ''
      : method.length === 1
        ? method[0]
        : `${method[0]} 외 ${method.length - 1}`

  const submit = () => {
    if (!valid) return

    addRoutine({
      id: 'custom-' + Date.now(),
      name: name.trim(),
      kcal: estKcal,
      tag: category || '사용자',
      duration: `${min}분`,
      minutes: min,
    })

    navigate('/manage/exercise/new/done')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="새 운동루틴 만들기" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">
        {/* 운동 카테고리 */}
        <section>
          <h2 className="text-[14px] font-bold text-gray-900">
            운동 카테고리
          </h2>

          <p className="mb-3 mt-1 text-[9px] text-gray-400">
            운동 루틴의 주요 부위를 선택해주세요
          </p>

          <div className="flex flex-wrap gap-2">
            {ROUTINE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  'rounded-full px-4 py-2 text-[11px] transition-colors ' +
                  (c === category
                    ? 'bg-[#31C66B] font-semibold text-white'
                    : 'bg-[#F5F5F5] text-gray-500')
                }
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* 운동 상세 정보 */}
        <section className="mt-8">
          <h2 className="text-[14px] font-bold text-gray-900">
            운동 상세 정보
          </h2>

          <p className="mb-3 mt-1 text-[9px] text-gray-400">
            운동 루틴에 필요한 정보를 입력해주세요
          </p>

          <div className="divide-y divide-gray-100 rounded-xl bg-[#F8F8F8] px-4">
            {/* 이름 */}
            <div className="flex min-h-[58px] items-center justify-between gap-3">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-600">
                운동 루틴 이름
                <Check done={name.trim() !== ''} />
              </span>

              <div className="flex min-w-0 items-center gap-1.5">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 입력"
                  className="min-w-0 flex-1 bg-transparent text-right text-[11px] font-semibold text-gray-900 outline-none placeholder:text-gray-300"
                />

                <IconPencil className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              </div>
            </div>

            {/* 난이도 */}
            <div className="flex min-h-[58px] items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                운동 난이도
                <Check done={level !== ''} />
              </span>

              <div className="flex gap-1.5">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(lv)}
                    className={
                      'flex h-7 w-7 items-center justify-center rounded-full text-[10px] ' +
                      (lv === level
                        ? 'bg-[#31C66B] font-semibold text-white'
                        : 'bg-white text-gray-500')
                    }
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            {/* 운동 방법 */}
            <div className="flex min-h-[58px] items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                운동 방법
                <Check done={method.length > 0} />
              </span>

              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-900"
              >
                <span className={methodLabel ? '' : 'text-gray-300'}>
                  {methodLabel || '선택'}
                </span>

                <IconPencil className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>

            {/* 횟수 / 세트 */}
            <div className="flex min-h-[58px] items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                횟수 / 세트
                <Check done={r > 0 && s > 0} />
              </span>

              <div className="flex items-center gap-1.5">
                <input
                  value={reps}
                  onChange={(e) =>
                    setReps(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="numeric"
                  placeholder="0"
                  className="h-7 w-9 rounded-md bg-white text-center text-[11px] font-medium outline-none"
                />

                <span className="text-[9px] text-gray-400">
                  회
                </span>

                <input
                  value={sets}
                  onChange={(e) =>
                    setSets(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="numeric"
                  placeholder="0"
                  className="h-7 w-9 rounded-md bg-white text-center text-[11px] font-medium outline-none"
                />

                <span className="text-[9px] text-gray-400">
                  세트
                </span>
              </div>
            </div>

            {/* 지속시간 */}
            <div className="flex min-h-[58px] items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                운동 지속시간
                <Check done={min > 0} />
              </span>

              <div className="flex items-center gap-1.5">
                <input
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(e.target.value.replace(/\D/g, ''))
                  }
                  inputMode="numeric"
                  placeholder="0"
                  className="h-7 w-11 rounded-md bg-white text-center text-[11px] font-medium outline-none"
                />

                <span className="text-[9px] text-gray-400">
                  분
                </span>
              </div>
            </div>

            {/* 예상 운동량 */}
            <div className="flex min-h-[66px] items-center justify-between">
              <span className="text-[11px] font-medium text-gray-700">
                총 예상 운동량
              </span>

              <span className="text-[22px] font-extrabold text-[#31C66B]">
                {estKcal}
                <span className="ml-1 text-[10px] font-medium">
                  kcal
                </span>
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white px-6 pb-6 pt-4">
        <button
          type="button"
          onClick={submit}
          disabled={!valid}
          className={
            'w-full rounded-full py-3.5 text-[15px] font-bold transition-colors ' +
            (valid
              ? 'bg-[#31C66B] text-white active:bg-[#29B760]'
              : 'cursor-not-allowed bg-gray-200 text-gray-400')
          }
        >
          루틴 추가하기
        </button>
      </div>

      <ExercisePicker
        open={pickerOpen}
        initialSelected={method}
        onClose={() => setPickerOpen(false)}
        onConfirm={(names) => {
          setMethod(names)
          setPickerOpen(false)
        }}
      />
    </div>
  )
}

export default RoutineCreate