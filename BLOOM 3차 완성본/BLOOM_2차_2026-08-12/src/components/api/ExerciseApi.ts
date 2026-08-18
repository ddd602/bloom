import type { Routine } from '../types/routines'

import {
  createActivity,
} from './ActivityApi'

export type DailyExerciseRecord = {
  date: string
  routines: Routine[]
  createdAt?: string
  updatedAt?: string
}

const ROUTINES_KEY =
  'bloom.routines'

const COMPLETED_KEY =
  'bloom.completedToday'

// ==============================
// 오늘 날짜
// ==============================

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

// ==============================
// Date → yyyy-MM-dd
// ==============================

function toDateKey(
  date: Date,
) {
  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}

// ==============================
// 루틴 목록 localStorage 조회
//
// 루틴 자체는 백엔드 API가 없으므로
// localStorage 유지
// ==============================

function readRoutines():
  Routine[] {
  const saved =
    localStorage.getItem(
      ROUTINES_KEY,
    )

  if (!saved) {
    return []
  }

  try {
    const parsed =
      JSON.parse(
        saved,
      )

    return Array.isArray(
      parsed,
    )
      ? parsed as Routine[]
      : []
  } catch {
    return []
  }
}

// ==============================
// 루틴 목록 localStorage 저장
// ==============================

function writeRoutines(
  routines: Routine[],
) {
  localStorage.setItem(
    ROUTINES_KEY,
    JSON.stringify(
      routines,
    ),
  )
}

// ==============================
// 완료 운동 기록 localStorage 조회
//
// 세부 루틴 표시를 위해
// localStorage 유지
// ==============================

function readCompletedRecords():
  DailyExerciseRecord[] {
  const saved =
    localStorage.getItem(
      COMPLETED_KEY,
    )

  if (!saved) {
    return []
  }

  try {
    const parsed =
      JSON.parse(
        saved,
      )

    // 현재 날짜별 구조
    if (
      Array.isArray(
        parsed,
      ) &&
      parsed.length > 0 &&
      typeof parsed[0] ===
        'object' &&
      'date' in parsed[0] &&
      'routines' in parsed[0]
    ) {
      return parsed as DailyExerciseRecord[]
    }

    if (
      Array.isArray(
        parsed,
      ) &&
      parsed.length === 0
    ) {
      return []
    }

    // 예전 배열 구조 마이그레이션
    if (
      Array.isArray(
        parsed,
      )
    ) {
      const now =
        new Date()
          .toISOString()

      const migrated:
        DailyExerciseRecord[] = [
        {
          date:
            getTodayDate(),

          routines:
            parsed as Routine[],

          createdAt:
            now,

          updatedAt:
            now,
        },
      ]

      localStorage.setItem(
        COMPLETED_KEY,
        JSON.stringify(
          migrated,
        ),
      )

      return migrated
    }

    return []
  } catch {
    return []
  }
}

// ==============================
// 완료 운동 localStorage 저장
// ==============================

function writeCompletedRecords(
  records:
    DailyExerciseRecord[],
) {
  localStorage.setItem(
    COMPLETED_KEY,
    JSON.stringify(
      records,
    ),
  )
}

// ==============================
// 루틴 전체 조회
// ==============================

export async function getRoutines():
  Promise<Routine[]> {
  return readRoutines()
}

// ==============================
// 루틴 생성
//
// 서버 Routine API가 없으므로
// localStorage 저장
// ==============================

export async function createRoutine(
  routine: Routine,
): Promise<Routine> {
  const routines =
    readRoutines()

  writeRoutines([
    ...routines,
    routine,
  ])

  return routine
}

// ==============================
// 루틴 삭제
// ==============================

export async function deleteRoutine(
  id: string,
): Promise<void> {
  const routines =
    readRoutines()

  const next =
    routines.filter(
      (routine) =>
        routine.id !==
        id,
    )

  writeRoutines(
    next,
  )
}

// ==============================
// 날짜별 완료 운동 조회
// ==============================

export async function getCompletedExercisesByDate(
  date: string,
): Promise<DailyExerciseRecord> {
  const records =
    readCompletedRecords()

  const target =
    records.find(
      (record) =>
        record.date ===
        date,
    )

  if (target) {
    return target
  }

  return {
    date,
    routines: [],
  }
}

// ==============================
// 완료 운동 전체 조회
// ==============================

export async function getCompletedExerciseRecords():
  Promise<DailyExerciseRecord[]> {
  return readCompletedRecords()
}

// ==============================
// 완료 운동 세부 기록 저장
//
// Routine 세부정보를 저장할
// 백엔드 API가 없기 때문에
// localStorage에는 계속 저장
// ==============================

export async function addCompletedExercise(
  date: string,
  routine: Routine,
): Promise<DailyExerciseRecord> {
  const records =
    readCompletedRecords()

  const existing =
    records.find(
      (record) =>
        record.date ===
        date,
    )

  const now =
    new Date()
      .toISOString()

  if (existing) {
    const updated:
      DailyExerciseRecord = {
      ...existing,

      routines: [
        ...existing.routines,
        routine,
      ],

      updatedAt:
        now,
    }

    const next =
      records.map(
        (record) =>
          record.date ===
          date
            ? updated
            : record,
      )

    writeCompletedRecords(
      next,
    )

    return updated
  }

  const created:
    DailyExerciseRecord = {
    date,

    routines: [
      routine,
    ],

    createdAt:
      now,

    updatedAt:
      now,
  }

  writeCompletedRecords([
    ...records,
    created,
  ])

  return created
}

// ==============================
// 하루 운동 kcal 합계
// ==============================

export async function getDailyExerciseTotal(
  date: string,
): Promise<number> {
  const record =
    await getCompletedExercisesByDate(
      date,
    )

  return record.routines.reduce(
    (
      total,
      routine,
    ) =>
      total +
      (
        Number(
          routine.kcal,
        ) || 0
      ),
    0,
  )
}

// ==============================
// 연속 운동 완료일 계산
//
// 세부 운동 기록은 localStorage에
// 있으므로 현재 그대로 사용
// ==============================

export async function getExerciseStreak():
  Promise<number> {
  const records =
    readCompletedRecords()

  const exerciseDates =
    new Set(
      records
        .filter(
          (record) =>
            record.routines
              .length > 0,
        )
        .map(
          (record) =>
            record.date,
        ),
    )

  let streak = 0

  const date =
    new Date()

  while (
    exerciseDates.has(
      toDateKey(
        date,
      ),
    )
  ) {
    streak++

    date.setDate(
      date.getDate() - 1,
    )
  }

  return streak
}

// ==============================
// 완료한 루틴 → Activity 서버 저장
//
// 루틴 자체는 localStorage.
//
// 실제 수행 결과만:
//
// steps = 0
// exerciseMinutes = 루틴 시간
// burnedKcal = 루틴 kcal
// memo = 루틴명
//
// POST
// /api/v1/diaries/{date}/activities
// ==============================

export async function saveCompletedRoutineActivity(
  date: string,
  routine: Routine,
): Promise<void> {
  const exerciseMinutes =
    Math.max(
      0,
      Math.min(
        1440,
        Number(
          routine.minutes,
        ) || 0,
      ),
    )

  const burnedKcal =
    Math.max(
      0,
      Math.min(
        10000,
        Number(
          routine.kcal,
        ) || 0,
      ),
    )

  const memo =
    `EXERCISE:${routine.name}`
      .slice(
        0,
        200,
      )

  await createActivity(
    date,
    {
      steps: 0,

      exerciseMinutes,

      burnedKcal,

      memo,
    },
  )
}