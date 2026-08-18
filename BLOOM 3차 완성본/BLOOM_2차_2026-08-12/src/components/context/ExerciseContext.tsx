import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'
import type { Routine } from '../types/routines'

import {
  getRoutines,
  createRoutine,
  deleteRoutine,
  getCompletedExercisesByDate,
  addCompletedExercise,
} from '../api/ExerciseApi'


type ExerciseState = {
  routines: Routine[]

  dailyTotal: number

  completedToday: Routine[]

  activeRoutine: Routine | null

  upcomingRoutines: Routine[]

  sessionCompleted: Routine[]

  lastCreated: Routine | null

  startRoutine: (
    routine: Routine,
  ) => void

  addUpcoming: (
    routine: Routine,
  ) => void

  completeActive: () =>
    Routine | null

  addRoutine: (
    routine: Routine,
  ) => void

  removeRoutine: (
    id: string,
  ) => void
}


const ExerciseContext =
  createContext<
    ExerciseState | null
  >(null)


function getTodayDate() {
  const today =
    new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      today.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}


export function ExerciseProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    routines,
    setRoutines,
  ] =
    useState<Routine[]>([])

  const [
    completedToday,
    setCompletedToday,
  ] =
    useState<Routine[]>([])

  const [
    activeRoutine,
    setActiveRoutine,
  ] =
    useState<Routine | null>(
      null,
    )

  const [
    upcomingRoutines,
    setUpcomingRoutines,
  ] =
    useState<Routine[]>([])

  const [
    sessionCompleted,
    setSessionCompleted,
  ] =
    useState<Routine[]>([])

  const [
    lastCreated,
    setLastCreated,
  ] =
    useState<Routine | null>(
      null,
    )


  // ==========================
  // 처음 실행할 때
  // 루틴 + 오늘 완료 운동 조회
  // ==========================

  useEffect(() => {
    const loadExerciseData =
      async () => {
        try {
          const today =
            getTodayDate()

          const [
            savedRoutines,
            completedRecord,
          ] =
            await Promise.all([
              getRoutines(),

              getCompletedExercisesByDate(
                today,
              ),
            ])

          setRoutines(
            savedRoutines,
          )

          setCompletedToday(
            completedRecord.routines,
          )
        } catch (error) {
          console.error(
            '운동 데이터를 불러오지 못했습니다.',
            error,
          )

          setRoutines([])
          setCompletedToday([])
        }
      }

    loadExerciseData()
  }, [])


  // ==========================
  // 일일 총 운동량
  // ==========================

  const dailyTotal =
    completedToday.reduce(
      (
        sum,
        routine,
      ) =>
        sum +
        (Number(
          routine.kcal,
        ) || 0),

      0,
    )


  // ==========================
  // 루틴 시작
  // ==========================

  const startRoutine = (
    routine: Routine,
  ) => {
    setActiveRoutine(
      routine,
    )

    setUpcomingRoutines(
      [],
    )

    setSessionCompleted(
      [],
    )
  }


  // ==========================
  // 다음 루틴 추가
  // ==========================

  const addUpcoming = (
    routine: Routine,
  ) => {
    setUpcomingRoutines(
      (prev) => [
        ...prev,
        routine,
      ],
    )
  }


  // ==========================
  // 현재 루틴 완료
  // ==========================

  const completeActive =
    (): Routine | null => {
      if (
        !activeRoutine
      ) {
        return null
      }

      const completed =
        activeRoutine

      // 화면 state 즉시 반영
      setCompletedToday(
        (prev) => [
          ...prev,
          completed,
        ],
      )

      setSessionCompleted(
        (prev) => [
          ...prev,
          completed,
        ],
      )

      // ExerciseApi를 통해 저장
      const today =
        getTodayDate()

      addCompletedExercise(
        today,
        completed,
      ).catch(
        (error) => {
          console.error(
            '완료 운동 저장에 실패했습니다.',
            error,
          )
        },
      )

      const [
        next,
        ...rest
      ] =
        upcomingRoutines

      if (next) {
        setUpcomingRoutines(
          rest,
        )

        setActiveRoutine(
          next,
        )

        return next
      }

      setActiveRoutine(
        null,
      )

      return null
    }


  // ==========================
  // 새 루틴 추가
  // ==========================

  const addRoutine = (
    routine: Routine,
  ) => {
    // 화면에 먼저 반영
    setRoutines(
      (prev) => [
        ...prev,
        routine,
      ],
    )

    setLastCreated(
      routine,
    )

    // ExerciseApi 저장
    createRoutine(
      routine,
    ).catch(
      (error) => {
        console.error(
          '운동 루틴 저장에 실패했습니다.',
          error,
        )
      },
    )
  }


  // ==========================
  // 루틴 삭제
  // ==========================

  const removeRoutine = (
    id: string,
  ) => {
    // 화면에서 즉시 제거
    setRoutines(
      (prev) =>
        prev.filter(
          (routine) =>
            routine.id !== id,
        ),
    )

    // ExerciseApi에서도 삭제
    deleteRoutine(
      id,
    ).catch(
      (error) => {
        console.error(
          '운동 루틴 삭제에 실패했습니다.',
          error,
        )
      },
    )
  }


  return (
    <ExerciseContext.Provider
      value={{
        routines,

        dailyTotal,

        completedToday,

        activeRoutine,

        upcomingRoutines,

        sessionCompleted,

        lastCreated,

        startRoutine,

        addUpcoming,

        completeActive,

        addRoutine,

        removeRoutine,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export function useExercise() {
  const context =
    useContext(
      ExerciseContext,
    )

  if (!context) {
    throw new Error(
      'useExercise must be used within ExerciseProvider',
    )
  }

  return context
}