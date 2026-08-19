type Props = {
  open: boolean
  rewardType:
    | 'ATTENDANCE'
    | 'ROUTINE'
  stage:
    | 'READY'
    | 'DONE'
  streak: number
  amount: number
  balance: number | null
  loading?: boolean
  hasNextReward?: boolean
  onPrimary: () => void
  onClose: () => void
}

function AttendanceStamp({
  active,
  index,
}: {
  active: boolean
  index: number
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={
          'relative flex h-[42px] w-[42px] items-center justify-center rounded-full border-[2px] ' +
          (
            active
              ? 'border-[#31C66B] bg-[#ECF9F0]'
              : 'border-[#D8D8D8] bg-[#F5F5F5]'
          )
        }
      >
        {active ? (
          <>
            <div className="absolute h-[24px] w-[24px] rounded-full bg-[#31C66B]" />
            <span className="relative z-10 text-[15px] font-black leading-none text-white">
              ✓
            </span>
          </>
        ) : (
          <span className="text-[16px] font-bold text-[#C7C7C7]">
            ·
          </span>
        )}
      </div>

      <span
        className={
          'text-[8px] font-medium ' +
          (
            active
              ? 'text-[#31A965]'
              : 'text-gray-300'
          )
        }
      >
        {index + 1}일
      </span>
    </div>
  )
}

function RoutineBadge({
  streak,
}: {
  streak: number
}) {
  return (
    <div className="relative mx-auto mt-6 flex h-[104px] w-[104px] items-center justify-center">
      <div className="absolute h-[92px] w-[92px] rounded-full bg-[#EAF8EC]" />
      <div className="absolute h-[76px] w-[76px] rounded-full border-[3px] border-[#31C66B]" />

      <div className="relative z-10 text-center">
        <p className="text-[10px] font-bold text-[#31A965]">
          ROUTINE
        </p>

        <p className="mt-0.5 text-[24px] font-black leading-none text-[#31C66B]">
          D+{streak}
        </p>
      </div>
    </div>
  )
}

export default function AttendanceRewardModal({
  open,
  rewardType,
  stage,
  streak,
  amount,
  balance,
  loading = false,
  hasNextReward = false,
  onPrimary,
  onClose,
}: Props) {
  if (!open) {
    return null
  }

  const isAttendance =
    rewardType ===
    'ATTENDANCE'

  const visibleAttendance =
    Math.max(
      1,
      Math.min(
        streak,
        5,
      ),
    )

  const routineReward =
    streak >= 14
      ? 500
      : streak >= 7
        ? 300
        : 100

  const readyTitle =
    isAttendance
      ? streak >= 5
        ? '연속 출석 성공!'
        : `${streak}일 연속 출석!`
      : `${streak}일 루틴 달성!`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5">
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-[18px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-[20px] font-light text-gray-400 active:bg-gray-100"
        >
          ×
        </button>

        {stage ===
        'READY' ? (
          <div className="px-6 pb-6 pt-8">
            <div className="text-center">
              <h2 className="text-[21px] font-black tracking-[-0.4px] text-gray-900">
                {readyTitle}
              </h2>

              <p className="mt-2 text-[10px] leading-[16px] text-gray-400">
                {isAttendance
                  ? '오늘도 BLOOM과 함께해주셨네요!'
                  : '꾸준한 루틴을 이어가고 있어요!'}
              </p>
            </div>

            {isAttendance ? (
              <div className="mt-7 flex items-start justify-between">
                {Array.from(
                  {
                    length: 5,
                  },
                  (
                    _,
                    index,
                  ) => (
                    <AttendanceStamp
                      key={
                        index
                      }
                      index={
                        index
                      }
                      active={
                        index <
                        visibleAttendance
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <RoutineBadge
                streak={
                  streak
                }
              />
            )}

            <div className="mt-6 rounded-[14px] bg-[#F3FBF5] px-4 py-3 text-center">
              <p className="text-[10px] font-medium text-gray-500">
                받을 수 있는 포인트
              </p>

              <p className="mt-1 text-[22px] font-black text-[#31C66B]">
                {isAttendance
                  ? '100P'
                  : `${routineReward.toLocaleString()}P`}
              </p>
            </div>

            <button
              type="button"
              onClick={
                onPrimary
              }
              disabled={
                loading
              }
              className="mt-5 w-full rounded-full bg-[#31C66B] py-[13px] text-[14px] font-bold text-white shadow-[0_5px_14px_rgba(49,198,107,0.26)] transition active:scale-[0.99] active:bg-[#2AB760] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? '포인트 지급 중...'
                : '포인트 받기'}
            </button>
          </div>
        ) : (
          <div className="px-6 pb-6 pt-9">
            <div className="text-center">
              <h2 className="text-[21px] font-black tracking-[-0.4px] text-gray-900">
                포인트 지급 완료!
              </h2>

              <p className="mt-2 text-[10px] leading-[16px] text-gray-400">
                {isAttendance
                  ? '오늘의 출석 보상이 지급됐어요.'
                  : `${streak}일 루틴 달성 보상이 지급됐어요.`}
              </p>
            </div>

            <div className="relative mx-auto mt-7 flex h-[112px] w-[112px] items-center justify-center">
              <div className="absolute h-[104px] w-[104px] rounded-full bg-[#ECF9F0]" />
              <div className="absolute h-[82px] w-[82px] rounded-full border-[4px] border-[#31C66B] bg-white" />

              <div className="relative z-10 text-center">
                <p className="text-[28px] font-black leading-none text-[#31C66B]">
                  P
                </p>

                <p className="mt-2 text-[9px] font-bold text-[#31A965]">
                  BLOOM POINT
                </p>
              </div>
            </div>

            <p className="mt-2 text-center text-[22px] font-black tracking-[-0.4px] text-[#31C66B]">
              +{amount.toLocaleString()}P
            </p>

            {balance !==
              null && (
              <p className="mt-2 text-center text-[9px] text-gray-400">
                현재 보유 포인트{' '}
                <span className="font-semibold text-gray-500">
                  {balance.toLocaleString()}P
                </span>
              </p>
            )}

            <button
              type="button"
              onClick={
                onPrimary
              }
              className="mt-6 w-full rounded-full bg-[#31C66B] py-[13px] text-[14px] font-bold text-white shadow-[0_5px_14px_rgba(49,198,107,0.26)] transition active:scale-[0.99] active:bg-[#2AB760]"
            >
              {hasNextReward
                ? '다음 보상 확인'
                : '마이페이지 가기'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}