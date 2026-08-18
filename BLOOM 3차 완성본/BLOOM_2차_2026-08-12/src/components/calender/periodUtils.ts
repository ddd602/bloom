import type { Period } from '../api/PeriodApi'

export type PeriodPhase =
  | '생리중'
  | '생리예정일'
  | '가임기'
  | '생리전'

export type PeriodTone =
  | 'green'
  | 'yellow'
  | 'gray'

export type PeriodStatus = {
  phase: PeriodPhase
  tone: PeriodTone
  dayInPeriod?: number
  daysUntilNext?: number
  message?: string
}

function eachDate(start: string, end: string): string[] {
  const s = new Date(start)
  const e = new Date(end)

  const out: string[] = []
  const cur = new Date(s)

  while (cur <= e) {
    const mm = String(cur.getMonth() + 1).padStart(2, '0')
    const dd = String(cur.getDate()).padStart(2, '0')

    out.push(
      `${cur.getFullYear()}-${mm}-${dd}`,
    )

    cur.setDate(cur.getDate() + 1)
  }

  return out
}

export function expandPeriods(list: Period[]): Set<string> {
  const set = new Set<string>()

  for (const p of list) {
    const [start, end] =
      p.start <= p.end
        ? [p.start, p.end]
        : [p.end, p.start]

    for (const key of eachDate(start, end)) {
      set.add(key)
    }
  }

  return set
}

export function periodContaining(
  list: Period[],
  key: string,
): Period | undefined {
  return list.find((p) => {
    const [start, end] =
      p.start <= p.end
        ? [p.start, p.end]
        : [p.end, p.start]

    return key >= start && key <= end
  })
}

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`)
}

function diffDays(a: string, b: string) {
  return Math.round(
    (parseDate(a).getTime() - parseDate(b).getTime()) /
      86400000,
  )
}

function keyOf(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function addDays(key: string, n: number) {
  return keyOf(
    new Date(
      parseDate(key).getTime() +
        n * 86400000,
    ),
  )
}

export function periodStatus(
  dateKey: string,
  list: Period[],
): PeriodStatus | null {
  if (list.length === 0) return null

  const sorted = [...list]
    .map((p) =>
      p.start <= p.end
        ? p
        : {
            start: p.end,
            end: p.start,
          },
    )
    .sort((a, b) =>
      a.start < b.start ? -1 : 1,
    )

  let cycle = 28

  if (sorted.length >= 2) {
    let sum = 0

    for (let i = 1; i < sorted.length; i++) {
      sum += diffDays(
        sorted[i].start,
        sorted[i - 1].start,
      )
    }

    cycle = Math.min(
      40,
      Math.max(
        20,
        Math.round(
          sum /
            (sorted.length - 1),
        ),
      ),
    )
  }

  let lenSum = 0

  for (const p of sorted) {
    lenSum +=
      diffDays(
        p.end,
        p.start,
      ) + 1
  }

  const periodLen = Math.max(
    1,
    Math.round(
      lenSum /
        sorted.length,
    ),
  )

  const inPeriod = sorted.find(
    (p) =>
      dateKey >= p.start &&
      dateKey <= p.end,
  )

  if (inPeriod) {
    return {
      phase: '생리중',
      tone: 'green',
      dayInPeriod:
        diffDays(
          dateKey,
          inPeriod.start,
        ) + 1,
      message:
        '생리가 끝난다면 기록을 추가해주세요!',
    }
  }

  const decide = (
    daysUntil: number,
  ): PeriodStatus =>
    daysUntil >= 12 &&
    daysUntil <= 16
      ? {
          phase: '가임기',
          tone: 'gray',
          daysUntilNext: daysUntil,
        }
      : {
          phase: '생리전',
          tone: 'gray',
          daysUntilNext: daysUntil,
        }

  const lastStart =
    sorted[
      sorted.length - 1
    ].start

  const gap =
    diffDays(
      dateKey,
      lastStart,
    )

  if (gap > 0) {
    const kFloor =
      Math.floor(
        gap / cycle,
      )

    if (kFloor >= 1) {
      const predStart =
        addDays(
          lastStart,
          kFloor * cycle,
        )

      const dayInPred =
        diffDays(
          dateKey,
          predStart,
        ) + 1

      if (
        dayInPred >= 1 &&
        dayInPred <= periodLen
      ) {
        return {
          phase:
            '생리예정일',
          tone:
            'yellow',
          daysUntilNext:
            0,
          message:
            '생리가 시작됐다면 기록을 추가해주세요!',
        }
      }
    }

    const nextPred =
      addDays(
        lastStart,
        (kFloor + 1) *
          cycle,
      )

    return decide(
      diffDays(
        nextPred,
        dateKey,
      ),
    )
  }

  const recNext =
    sorted.find(
      (p) =>
        p.start > dateKey,
    )

  const nextStart =
    recNext
      ? recNext.start
      : lastStart

  return decide(
    diffDays(
      nextStart,
      dateKey,
    ),
  )
}