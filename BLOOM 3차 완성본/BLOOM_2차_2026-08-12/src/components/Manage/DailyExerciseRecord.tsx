import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import RoutineCard from './RoutineCard'

import {
  getCompletedExercisesByDate,
} from '../api/ExerciseApi'

import type { Routine } from '../types/routines'

type Props = {
  date?: string
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function DailyExerciseRecord({ date }: Props) {
  const navigate = useNavigate()
  const targetDate = date ?? getTodayDate()

  const [routines, setRoutines] = useState<Routine[]>([])
  const [dailyTotal, setDailyTotal] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const record =
          await getCompletedExercisesByDate(targetDate)

        setRoutines(record.routines)

        const total = record.routines.reduce(
          (sum, routine) =>
            sum + (Number(routine.kcal) || 0),
          0,
        )

        setDailyTotal(total)
      } catch (error) {
        console.error(
          '운동 기록을 불러오지 못했습니다.',
          error,
        )

        setRoutines([])
        setDailyTotal(0)
      }
    }

    loadData()
  }, [targetDate])

  return (
    <div className="rounded-[5px] bg-[#FAFAFA] px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-bold text-gray-900">
          일일 운동 기록
        </p>

        <p className="text-[9px] font-medium text-gray-700">
          총 운동량{' '}
          <span className="ml-1 text-[13px] font-bold text-[#31C66B]">
            {dailyTotal} kcal
          </span>
        </p>
      </div>

      {routines.length === 0 ? (
        <div className="flex h-[54px] items-center justify-center rounded-[5px] bg-white text-[10px] text-gray-400 shadow-sm">
          아직 운동 기록이 없어요
        </div>
      ) : (
        <div className="space-y-2">
          {routines.map((routine, index) => (
            <RoutineCard
              key={`${routine.id}-${index}`}
              routine={routine}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate('/manage/exercise')}
        className="mt-3 flex h-[50px] w-full items-center justify-center rounded-md border border-[#42DB83] bg-[#F0FBF4] text-[11px] text-gray-500"
      >
        <span className="mr-2 text-xl font-light text-gray-400">
          +
        </span>

        운동 기록 만들러 가기
      </button>
    </div>
  )
}

export default DailyExerciseRecord