import {
  useEffect,
  useState,
} from 'react'

import ScreenHeader from '../components/ScreenHeader'

import {
  getMileageBalance,
  getMileageHistory,
  type MileageHistoryResponse,
  type MileageReason,
} from '../components/api/MileageApi'

const REASON_LABELS:
  Record<
    MileageReason,
    string
  > = {
  ATTENDANCE:
    '출석 리워드',
  STORE_PURCHASE:
    '스토어 구매',
  ROUTINE_STREAK_3:
    '운동 루틴 3일 달성',
  ROUTINE_STREAK_7:
    '운동 루틴 7일 달성',
  ROUTINE_STREAK_14:
    '운동 루틴 14일 달성',
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    'ko-KR',
    {
      timeZone:
        'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  ).format(
    new Date(value),
  )
}

export default function Points() {
  const [
    balance,
    setBalance,
  ] = useState(0)

  const [
    history,
    setHistory,
  ] =
    useState<
      MileageHistoryResponse[]
    >([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  useEffect(() => {
    const load =
      async () => {
        try {
          const [
            balanceResult,
            historyResult,
          ] =
            await Promise.all([
              getMileageBalance(),
              getMileageHistory(),
            ])

          setBalance(
            balanceResult.balance,
          )

          setHistory(
            historyResult,
          )
        } catch (error) {
          console.error(
            '포인트 정보를 불러오지 못했습니다.',
            error,
          )

          setError(
            '포인트 정보를 불러오지 못했어요.',
          )
        } finally {
          setLoading(
            false,
          )
        }
      }

    void load()
  }, [])

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="포인트" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6">
        <div className="rounded-2xl bg-[#EAF8EC] px-5 py-5">
          <p className="text-[10px] text-gray-500">
            보유 포인트
          </p>

          <p className="mt-2 text-[28px] font-extrabold text-[#31C66B]">
            {balance.toLocaleString()}
            <span className="ml-1 text-[13px] font-bold">
              P
            </span>
          </p>
        </div>

        <h2 className="mt-8 text-[15px] font-bold text-gray-900">
          포인트 내역
        </h2>

        {loading ? (
          <p className="py-10 text-center text-[11px] text-gray-400">
            포인트 내역을 불러오고 있어요...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-[11px] text-red-500">
            {error}
          </p>
        ) : history.length === 0 ? (
          <p className="py-10 text-center text-[11px] text-gray-400">
            아직 포인트 내역이 없어요.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-gray-100">
            {history.map(
              (item) => (
                <div
                  key={
                    item.mileageHistoryId
                  }
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="text-[12px] font-semibold text-gray-800">
                      {
                        REASON_LABELS[
                          item.reason
                        ]
                      }
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {
                        formatDate(
                          item.createdAt,
                        )
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={
                        'text-[13px] font-bold ' +
                        (
                          item.type ===
                          'EARN'
                            ? 'text-[#31C66B]'
                            : 'text-gray-700'
                        )
                      }
                    >
                      {item.type ===
                      'EARN'
                        ? '+'
                        : '-'}
                      {Math.abs(
                        item.amount,
                      ).toLocaleString()}
                      P
                    </p>

                    <p className="mt-1 text-[8px] text-gray-400">
                      잔액{' '}
                      {item.balanceAfter.toLocaleString()}
                      P
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}