import { apiFetch } from './ApiClient'

export type MileageType =
  | 'EARN'
  | 'SPEND'

export type MileageReason =
  | 'ATTENDANCE'
  | 'STORE_PURCHASE'
  | 'ROUTINE_STREAK_3'
  | 'ROUTINE_STREAK_7'
  | 'ROUTINE_STREAK_14'

export type MileageBalanceResponse = {
  balance: number
}

export type MileageHistoryResponse = {
  mileageHistoryId: number
  type: MileageType
  reason: MileageReason
  amount: number
  balanceAfter: number
  createdAt: string
}

export type MileageRewardResponse = {
  rewarded: boolean
  amount: number
  balance: number
  reason:
    | MileageReason
    | 'ALREADY_REWARDED'
    | 'NO_NEW_REWARD'
    | string
  streak: number | null
}

export async function getMileageBalance(): Promise<MileageBalanceResponse> {
  return apiFetch<MileageBalanceResponse>(
    '/api/v1/mileage',
  )
}

export async function getMileageHistory(): Promise<MileageHistoryResponse[]> {
  return apiFetch<MileageHistoryResponse[]>(
    '/api/v1/mileage/history',
  )
}

export async function claimAttendanceReward(): Promise<MileageRewardResponse> {
  return apiFetch<MileageRewardResponse>(
    '/api/v1/mileage/attendance',
    {
      method: 'POST',
    },
  )
}

export async function checkRoutineStreakReward(): Promise<MileageRewardResponse> {
  return apiFetch<MileageRewardResponse>(
    '/api/v1/mileage/routine-streak/check',
    {
      method: 'POST',
    },
  )
}