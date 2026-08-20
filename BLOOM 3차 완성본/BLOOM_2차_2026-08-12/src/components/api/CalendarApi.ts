import { apiFetch } from './ApiClient'

import {
  getDailyDiary,
  saveDailyDiary,
} from './DiaryApi'

// ==============================
// 캘린더에서 사용하는 다이어리 타입
// ==============================

export type Diary = {
  id: number
  date: string
  content: string
}

// ==============================
// 생성 요청
// ==============================

export type CreateDiaryRequest = {
  date: string
  content: string
}

// ==============================
// 수정 요청
// ==============================

export type UpdateDiaryRequest = {
  date?: string
  content?: string
}

// ==============================
// 백엔드 history 응답
// ==============================

type DiaryHistoryItem = {
  date: string

  weightKg: number | null

  emotionScore: number | null
  bodyScore: number | null

  waterMl: number | null

  totalCalories: number

  totalSteps: number
  totalExerciseMinutes: number
  totalBurnedKcal: number
}

// ==============================
// 날짜 → 프론트용 숫자 ID
//
// YYYY-MM-DD
// → YYYYMMDD
// ==============================

function dateToId(
  date: string,
) {
  return Number(
    date.replace(
      /-/g,
      '',
    ),
  )
}

// ==============================
// 숫자 ID → 날짜
// ==============================

function idToDate(
  id: number,
) {
  const value =
    String(id)

  if (
    value.length !== 8
  ) {
    throw new Error(
      '잘못된 다이어리 ID입니다.',
    )
  }

  return (
    `${value.slice(0, 4)}-` +
    `${value.slice(4, 6)}-` +
    `${value.slice(6, 8)}`
  )
}

// ==============================
// 기간별 다이어리 조회
//
// history에서 기록 존재 날짜 확인
// → 각 날짜 daily 조회
// → memo를 Calendar Diary로 변환
// ==============================

export async function getDiaries(
  from: string,
  to: string,
): Promise<Diary[]> {
  const history =
    await apiFetch<DiaryHistoryItem[]>(
      `/api/v1/diary/history?from=${encodeURIComponent(
        from,
      )}&to=${encodeURIComponent(
        to,
      )}`,
    )

  if (history.length === 0) {
    return []
  }

  // 백엔드가 혹시 전체 history를 반환하더라도
  // 현재 보고 있는 기간의 데이터만 사용
  const filteredHistory =
    history.filter(
      (item) =>
        item.date >= from &&
        item.date <= to,
    )

  if (filteredHistory.length === 0) {
    return []
  }

  const diaries =
    await Promise.all(
      filteredHistory.map(
        async (item) => {
          try {
            const daily =
              await getDailyDiary(
                item.date,
              )

            return {
              id: dateToId(
                item.date,
              ),

              date:
                item.date,

              content:
                daily.memo ?? '',
            }
          } catch {
            return null
          }
        },
      ),
    )

  return diaries.filter(
    (
      diary,
    ): diary is Diary =>
      diary !== null &&
      diary.content.trim() !== '',
  )
}

// ==============================
// 날짜별 다이어리 조회
// ==============================

export async function getDiaryByDate(
  date: string,
): Promise<Diary | null> {
  try {
    const daily =
      await getDailyDiary(
        date,
      )

    return {
      id:
        dateToId(
          date,
        ),

      date,

      content:
        daily.memo ??
        '',
    }
  } catch {
    return null
  }
}

// ==============================
// 다이어리 생성
//
// DailyDiary PATCH는
// 해당 날짜가 없으면 생성
// ==============================

export async function createDiary(
  diary: CreateDiaryRequest,
): Promise<Diary> {
  const saved =
    await saveDailyDiary({
      date:
        diary.date,

      memo:
        diary.content,
    })

  return {
    id:
      dateToId(
        saved.date,
      ),

    date:
      saved.date,

    content:
      saved.memo ??
      '',
  }
}

// ==============================
// 다이어리 수정
// ==============================

export async function updateDiary(
  id: number,
  diary: UpdateDiaryRequest,
): Promise<Diary> {
  const currentDate =
    idToDate(
      id,
    )

  const targetDate =
    diary.date ??
    currentDate

  const saved =
    await saveDailyDiary({
      date:
        targetDate,

      ...(diary.content !==
      undefined
        ? {
            memo:
              diary.content,
          }
        : {}),
    })

  return {
    id:
      dateToId(
        saved.date,
      ),

    date:
      saved.date,

    content:
      saved.memo ??
      '',
  }
}

// ==============================
// 메모 삭제
//
// Diary 자체 삭제 X
// memo만 null 처리
// ==============================

export async function deleteDiary(
  id: number,
): Promise<void> {
  const date =
    idToDate(
      id,
    )

  await saveDailyDiary({
    date,

    memo: null,
  })
}