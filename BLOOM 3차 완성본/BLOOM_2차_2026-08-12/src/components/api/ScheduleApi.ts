export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5173'

export type Schedule = {
  id: string
  date: string
  time: string
  title: string
  place: string
  createdAt?: string
  updatedAt?: string
}

const STORAGE_KEY = 'bloom.schedules'

function readSchedules(): Schedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return []

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed)
      ? (parsed as Schedule[])
      : []
  } catch {
    return []
  }
}

function writeSchedules(list: Schedule[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(list),
  )
}

export async function getSchedules(): Promise<Schedule[]> {
  return readSchedules()
}

export async function getSchedulesByDate(
  date: string,
): Promise<Schedule[]> {
  return readSchedules().filter(
    (schedule) => schedule.date === date,
  )
}

export async function addSchedule(
  data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Schedule> {
  const schedules = readSchedules()
  const now = new Date().toISOString()

  const created: Schedule = {
    ...data,
    id: genId(),
    createdAt: now,
    updatedAt: now,
  }

  writeSchedules([
    ...schedules,
    created,
  ])

  return created
}

export async function updateSchedule(
  id: string,
  data: Partial<Omit<Schedule, 'id'>>,
): Promise<Schedule | null> {
  const schedules = readSchedules()
  const target = schedules.find((schedule) => schedule.id === id)

  if (!target) return null

  const updated: Schedule = {
    ...target,
    ...data,
    id: target.id,
    updatedAt: new Date().toISOString(),
  }

  writeSchedules(
    schedules.map((schedule) =>
      schedule.id === id ? updated : schedule,
    ),
  )

  return updated
}

export async function deleteSchedule(id: string): Promise<void> {
  const schedules = readSchedules()

  writeSchedules(
    schedules.filter(
      (schedule) => schedule.id !== id,
    ),
  )
}

export function genId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6)
  )
}

export function formatKoreanDate(key: string) {
  const [, month, day] = key.split('-')

  return `${Number(month)}월 ${Number(day)}일`
}