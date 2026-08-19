import { apiFetch } from './ApiClient'

export type Period = {
  periodId?: number
  start: string
  end: string
  createdAt?: string
  updatedAt?: string
}

type PeriodResponse = {
  periodId: number
  startDate: string
  endDate: string
  createdAt?: string
  updatedAt?: string
}

type PeriodCreateRequest = {
  startDate: string
  endDate: string
}

type PeriodPatchRequest = {
  startDate?: string
  endDate?: string
}

function toPeriod(
  response: PeriodResponse,
): Period {
  return {
    periodId:
      response.periodId,
    start:
      response.startDate,
    end:
      response.endDate,
    createdAt:
      response.createdAt,
    updatedAt:
      response.updatedAt,
  }
}

function sameRange(
  a: Pick<
    Period,
    'start' | 'end'
  >,
  b: Pick<
    Period,
    'start' | 'end'
  >,
) {
  return (
    a.start ===
      b.start &&
    a.end ===
      b.end
  )
}

// ==============================
// 전체 생리 기록 조회
//
// GET /api/v1/periods
// ==============================

export async function getPeriods(): Promise<Period[]> {
  const result =
    await apiFetch<
      PeriodResponse[]
    >(
      '/api/v1/periods',
    )

  return result.map(
    toPeriod,
  )
}

// ==============================
// 생리 기록 추가
//
// POST /api/v1/periods
// ==============================

export async function addPeriod(
  period: {
    start: string
    end: string
  },
): Promise<Period[]> {
  const request:
    PeriodCreateRequest = {
    startDate:
      period.start,
    endDate:
      period.end,
  }

  await apiFetch<PeriodResponse>(
    '/api/v1/periods',
    {
      method: 'POST',
      body:
        JSON.stringify(
          request,
        ),
    },
  )

  return getPeriods()
}

// ==============================
// 생리 기록 수정
//
// 기존 프론트 호출부 호환을 위해
// originalStart를 그대로 받습니다.
//
// PATCH /api/v1/periods/{periodId}
// ==============================

export async function updatePeriod(
  originalStart: string,
  updated: {
    start: string
    end: string
  },
): Promise<Period[]> {
  const periods =
    await getPeriods()

  const target =
    periods.find(
      (period) =>
        period.start ===
        originalStart,
    )

  if (
    !target?.periodId
  ) {
    throw new Error(
      '수정할 생리 기록을 찾지 못했습니다.',
    )
  }

  const request:
    PeriodPatchRequest = {
    startDate:
      updated.start,
    endDate:
      updated.end,
  }

  await apiFetch<PeriodResponse>(
    `/api/v1/periods/${target.periodId}`,
    {
      method: 'PATCH',
      body:
        JSON.stringify(
          request,
        ),
    },
  )

  return getPeriods()
}

// ==============================
// 생리 기록 삭제
//
// 기존 프론트 호출부 호환을 위해
// start를 그대로 받습니다.
//
// DELETE /api/v1/periods/{periodId}
// ==============================

export async function deletePeriod(
  start: string,
): Promise<Period[]> {
  const periods =
    await getPeriods()

  const target =
    periods.find(
      (period) =>
        period.start ===
        start,
    )

  if (
    !target?.periodId
  ) {
    throw new Error(
      '삭제할 생리 기록을 찾지 못했습니다.',
    )
  }

  await apiFetch<void>(
    `/api/v1/periods/${target.periodId}`,
    {
      method: 'DELETE',
    },
  )

  return getPeriods()
}

// ==============================
// 월간 캘린더 호환용 전체 동기화
//
// 기존 MonthlyCalendar는
// savePeriods(next) 방식으로 동작하므로
// UI를 크게 바꾸지 않고 서버 CRUD로 동기화합니다.
//
// 새 범위      -> POST
// 빠진 범위    -> DELETE
// periodId가 있고 날짜 변경 -> PATCH
// ==============================

export async function savePeriods(
  desiredPeriods: Period[],
): Promise<Period[]> {
  const serverPeriods =
    await getPeriods()

  const desiredIds =
    new Set(
      desiredPeriods
        .map(
          (period) =>
            period.periodId,
        )
        .filter(
          (
            id,
          ): id is number =>
            id !== undefined,
        ),
    )

  const desiredRanges =
    new Set(
      desiredPeriods.map(
        (period) =>
          `${period.start}|${period.end}`,
      ),
    )

  // 서버에는 있는데 현재 화면 목록에서는 빠진 기록 삭제
  const toDelete =
    serverPeriods.filter(
      (serverPeriod) => {
        if (
          serverPeriod.periodId &&
          desiredIds.has(
            serverPeriod.periodId,
          )
        ) {
          return false
        }

        return !desiredRanges.has(
          `${serverPeriod.start}|${serverPeriod.end}`,
        )
      },
    )

  await Promise.all(
    toDelete.map(
      (period) => {
        if (
          !period.periodId
        ) {
          return Promise.resolve()
        }

        return apiFetch<void>(
          `/api/v1/periods/${period.periodId}`,
          {
            method:
              'DELETE',
          },
        )
      },
    ),
  )

  // 기존 ID가 있는 항목 중 날짜가 변경된 경우 수정
  const toUpdate =
    desiredPeriods.filter(
      (desired) => {
        if (
          !desired.periodId
        ) {
          return false
        }

        const server =
          serverPeriods.find(
            (period) =>
              period.periodId ===
              desired.periodId,
          )

        return (
          !!server &&
          !sameRange(
            server,
            desired,
          )
        )
      },
    )

  await Promise.all(
    toUpdate.map(
      (period) =>
        apiFetch<PeriodResponse>(
          `/api/v1/periods/${period.periodId}`,
          {
            method:
              'PATCH',
            body:
              JSON.stringify({
                startDate:
                  period.start,
                endDate:
                  period.end,
              }),
          },
        ),
    ),
  )

  // ID가 없고 서버에도 같은 날짜 범위가 없는 항목만 새로 추가
  const toCreate =
    desiredPeriods.filter(
      (desired) => {
        if (
          desired.periodId
        ) {
          return false
        }

        return !serverPeriods.some(
          (server) =>
            sameRange(
              server,
              desired,
            ),
        )
      },
    )

  await Promise.all(
    toCreate.map(
      (period) =>
        apiFetch<PeriodResponse>(
          '/api/v1/periods',
          {
            method:
              'POST',
            body:
              JSON.stringify({
                startDate:
                  period.start,
                endDate:
                  period.end,
              }),
          },
        ),
    ),
  )

  return getPeriods()
}