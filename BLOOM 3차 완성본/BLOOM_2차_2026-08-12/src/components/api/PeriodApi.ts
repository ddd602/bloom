export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

export type Period = {
  start: string
  end: string
  createdAt?: string
  updatedAt?: string
}

const STORAGE_KEY = 'bloom.periods'

function readPeriods(): Period[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return []

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed)
      ? (parsed as Period[])
      : []
  } catch {
    return []
  }
}

function writePeriods(periods: Period[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(periods),
  )
}

export async function getPeriods(): Promise<Period[]> {
  return readPeriods()
}

export async function savePeriods(
  periods: Period[],
): Promise<Period[]> {
  const existing = readPeriods()
  const now = new Date().toISOString()

  const saved = periods.map((period) => {
    const old = existing.find(
      (item) =>
        item.start === period.start &&
        item.end === period.end,
    )

    return {
      ...period,
      createdAt: old?.createdAt ?? period.createdAt ?? now,
      updatedAt: now,
    }
  })

  writePeriods(saved)

  return saved
}

export async function addPeriod(
  period: {
    start: string
    end: string
  },
): Promise<Period[]> {
  const periods = readPeriods()
  const now = new Date().toISOString()

  const created: Period = {
    start: period.start,
    end: period.end,
    createdAt: now,
    updatedAt: now,
  }

  const next = [
    ...periods,
    created,
  ]

  writePeriods(next)

  return next
}

export async function updatePeriod(
  originalStart: string,
  updated: {
    start: string
    end: string
  },
): Promise<Period[]> {
  const periods = readPeriods()
  const now = new Date().toISOString()

  const next = periods.map((period) =>
    period.start === originalStart
      ? {
          ...period,
          ...updated,
          updatedAt: now,
        }
      : period,
  )

  writePeriods(next)

  return next
}

export async function deletePeriod(
  start: string,
): Promise<Period[]> {
  const periods = readPeriods()

  const next = periods.filter(
    (period) => period.start !== start,
  )

  writePeriods(next)

  return next
}