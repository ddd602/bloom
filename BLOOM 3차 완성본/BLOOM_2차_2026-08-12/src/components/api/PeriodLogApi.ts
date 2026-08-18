export type PeriodLog = {
  date: string
  moodTags: string[]
  symptomTags: string[]
  createdAt?: string
  updatedAt?: string
}

const STORAGE_KEY = 'bloom.periodLogs'

function createEmptyLog(date: string): PeriodLog {
  return {
    date,
    moodTags: [],
    symptomTags: [],
  }
}

function readLogs(): PeriodLog[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return []
  }

  try {
    const parsed = JSON.parse(saved)

    return Array.isArray(parsed)
      ? (parsed as PeriodLog[])
      : []
  } catch {
    return []
  }
}

function writeLogs(logs: PeriodLog[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(logs),
  )
}

export async function getPeriodLogByDate(
  date: string,
): Promise<PeriodLog> {
  const logs = readLogs()

  const target = logs.find(
    (item) => item.date === date,
  )

  return target ?? createEmptyLog(date)
}

export async function savePeriodLog(
  log: PeriodLog,
): Promise<PeriodLog> {
  const logs = readLogs()

  const existing = logs.find(
    (item) => item.date === log.date,
  )

  const now = new Date().toISOString()

  if (existing) {
    const updated: PeriodLog = {
      ...existing,
      ...log,
      updatedAt: now,
    }

    writeLogs(
      logs.map((item) =>
        item.date === log.date
          ? updated
          : item,
      ),
    )

    return updated
  }

  const created: PeriodLog = {
    ...log,
    createdAt: now,
    updatedAt: now,
  }

  writeLogs([...logs, created])

  return created
}
