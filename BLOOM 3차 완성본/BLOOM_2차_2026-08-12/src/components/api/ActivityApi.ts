import { apiFetch } from './ApiClient'

import {
  getDailyDiary,
} from './DiaryApi'

// ==============================
// 서버 요청 타입
// ==============================

export type ActivityRequest = {
  steps: number
  exerciseMinutes: number
  burnedKcal: number
  memo: string | null
}

// ==============================
// 서버 응답 타입
// ==============================

export type ActivityResponse = {
  activityId: number
  steps: number
  exerciseMinutes: number
  burnedKcal: number
  memo: string | null
}

// ==============================
// 프론트에서 사용하는 날짜별 활동 데이터
// ==============================

export type ActivityData = {
  date: string
  steps: number
  kcal: number
  exerciseMinutes: number
}

// ==============================
// 날짜별 활동 합계 조회
//
// DailyDiaryResponse의 서버 계산값 사용
// ==============================

export async function getActivityByDate(
  date: string,
): Promise<ActivityData> {
  try {
    const daily =
      await getDailyDiary(
        date,
      )

    return {
      date,

      steps:
        daily.totalSteps,

      kcal:
        daily.totalBurnedKcal,

      exerciseMinutes:
        daily.totalExerciseMinutes,
    }
  } catch {
    // 아직 해당 날짜 다이어리가 없는 경우
    return {
      date,
      steps: 0,
      kcal: 0,
      exerciseMinutes: 0,
    }
  }
}

// ==============================
// Activity 생성
//
// POST
// /api/v1/diaries/{date}/activities
// ==============================

export async function createActivity(
  date: string,
  data: ActivityRequest,
): Promise<ActivityResponse> {
  return apiFetch<ActivityResponse>(
    `/api/v1/diaries/${date}/activities`,
    {
      method: 'POST',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

// ==============================
// Activity 수정
//
// PATCH
// /api/v1/activities/{activityId}
// ==============================

export async function updateActivity(
  activityId: number,
  data: ActivityRequest,
): Promise<ActivityResponse> {
  return apiFetch<ActivityResponse>(
    `/api/v1/activities/${activityId}`,
    {
      method: 'PATCH',

      body:
        JSON.stringify(
          data,
        ),
    },
  )
}

// ==============================
// Activity 삭제
//
// DELETE
// /api/v1/activities/{activityId}
// ==============================

export async function deleteActivity(
  activityId: number,
): Promise<void> {
  return apiFetch<void>(
    `/api/v1/activities/${activityId}`,
    {
      method: 'DELETE',
    },
  )
}