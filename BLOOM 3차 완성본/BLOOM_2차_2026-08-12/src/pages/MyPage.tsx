import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  logout,
} from '../components/api/AuthApi'


import {
  getProfile,
  type ProfileResponse,
} from '../components/api/ProfileApi'

import {
  getMileageBalance,
  getMileageHistory,
  type MileageHistoryResponse,
} from '../components/api/MileageApi'


import loginLogoUrl from '../assets/brand/login-logo.svg'
import profileUrl from '../assets/brand/profile-yellow.svg'

import {
  pickGoalVariant,
  PROFILE_BY_GOAL,
} from '../utils/characterVariant'

function maskEmail(
  email: string,
) {
  if (!email) return ''

  const [local, domain] =
    email.split('@')

  if (!domain) {
    return email
  }

  if (
    local.length <= 2
  ) {
    return `${local[0] ?? ''}***@${domain}`
  }

  return `${local.slice(0, 2)}***@${domain}`
}


function toSeoulDateString(
  value: Date,
) {
  const parts =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone:
          'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    ).formatToParts(
      value,
    )

  const year =
    parts.find(
      (part) =>
        part.type ===
        'year',
    )?.value

  const month =
    parts.find(
      (part) =>
        part.type ===
        'month',
    )?.value

  const day =
    parts.find(
      (part) =>
        part.type ===
        'day',
    )?.value

  return `${year}-${month}-${day}`
}

function MyPage() {
  const navigate =
    useNavigate()

  const [
    profile,
    setProfile,
  ] =
    useState<ProfileResponse | null>(
      null,
    )

  const [
    mileage,
    setMileage,
  ] =
    useState<
      number | null
    >(null)


  const [
    mileageHistory,
    setMileageHistory,
  ] =
    useState<
      MileageHistoryResponse[]
    >([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  // 온보딩에서 고른 목표에 맞는 캐릭터로 프로필 사진을 자동 설정
  const avatarUrl =
    profile
      ? PROFILE_BY_GOAL[
          pickGoalVariant(
            profile.beautyGoals,
          )
        ]
      : profileUrl

  useEffect(() => {
    const loadPage =
      async () => {
        try {
          const profileData =
            await getProfile()

          setProfile(
            profileData,
          )
        } catch (error) {
          console.error(
            '프로필 정보를 불러오지 못했습니다.',
            error,
          )
        }

        try {
          const [
            mileageData,
            mileageHistoryData,
          ] =
            await Promise.all([
              getMileageBalance(),
              getMileageHistory(),
            ])

          setMileage(
            mileageData.balance,
          )

          setMileageHistory(
            mileageHistoryData,
          )
        } catch (error) {
          console.error(
            '마일리지 정보를 불러오지 못했습니다.',
            error,
          )

          setMileage(0)
          setMileageHistory([])
        } finally {
          setLoading(false)
        }
      }

    void loadPage()
  }, [])

  const attendanceCount =
    Math.min(
      new Set(
        mileageHistory
          .filter(
            (item) =>
              item.reason ===
              'ATTENDANCE',
          )
          .map(
            (item) =>
              toSeoulDateString(
                new Date(
                  item.createdAt,
                ),
              ),
          ),
      ).size,
      5,
    )

  const handleLogOut =
    async () => {
      try {
        await logout()
      } catch (error) {
        console.error(
          '로그아웃 요청에 실패했습니다.',
          error,
        )
      } finally {
        navigate(
          '/welcome',
          {
            replace: true,
          },
        )
      }
    }

  const summary = [
    {
      label:
        '시술 내역',
      value:
        '-',
      to:
        '/my-page/treatments',
    },
    {
      label:
        '구매 내역',
      value:
        '-',
      to:
        '/my-page/purchases',
    },
    {
      label:
        '포인트',
      value:
        mileage === null
          ? '-'
          : `${mileage.toLocaleString()}P`,
      to:
        '/my-page/points',
    },
  ]

  return (
    <div className="flex h-full flex-col bg-white">
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-6
          pb-6
        "
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="mb-6 flex items-center">
          <img
            src={loginLogoUrl}
            alt="BLOOM"
            className="
              h-[28px]
              w-auto
              object-contain
            "
          />

        </div>

        <div className="mb-5 flex items-center">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/my-page/profile-settings',
              )
            }
            aria-label="내 정보 설정"
            className="
              relative
              h-[58px]
              w-[58px]
              shrink-0
              rounded-full
              focus:outline-none
            "
          >
            <span
              className="
                flex
                h-[58px]
                w-[58px]
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-[#F1F8F3]
              "
            >
              <img
                src={avatarUrl}
                alt="프로필"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </span>

            <span
              className="
                absolute
                bottom-[-1px]
                right-[-1px]
                flex
                h-[18px]
                w-[18px]
                items-center
                justify-center
                rounded-full
                border
                border-gray-100
                bg-white
                shadow-sm
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[10px] w-[10px] text-gray-500"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>
            </span>
          </button>

          <div className="ml-4 min-w-0 flex-1">
            <p className="text-[12px] font-bold text-gray-900">
              {loading
                ? '불러오는 중...'
                : `${profile?.nickname || '사용자'}님`}
            </p>

            <p className="mt-1 truncate text-[8px] text-gray-400">
              {profile?.email
                ? maskEmail(
                  profile.email,
                )
                : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleLogOut
            }
            className="
              shrink-0
              rounded-full
              border
              border-[#31C66B]
              px-4
              py-1
              text-[8px]
              font-medium
              text-[#31B76A]
            "
          >
            로그아웃
          </button>
        </div>

        <div
          className="
            mb-2
            flex
            items-center
            justify-between
            rounded-md
            bg-[#F5F5F5]
            px-4
            py-3
          "
        >
          <div>
            <p className="text-[8px] text-gray-400">
              현재 플랜
            </p>

            <p className="mt-1 text-[11px] font-bold text-gray-800">
              -
            </p>
          </div>

          <Link
            to="/my-page/membership"
            className="
              rounded-full
              bg-[#31C66B]
              px-4
              py-1.5
              text-[8px]
              font-semibold
              text-white
            "
          >
            멤버십 가입
          </Link>
        </div>

        <div className="mb-7 grid grid-cols-3 bg-[#EAF8EC]">
          {summary.map(
            (
              item,
              index,
            ) => (
              <Link
                key={
                  item.label
                }
                to={
                  item.to
                }
                className={
                  'flex flex-col items-center justify-center py-4 ' +
                  (
                    index > 0
                      ? 'border-l border-white'
                      : ''
                  )
                }
              >
                <span className="text-[9px] text-gray-500">
                  {
                    item.label
                  }
                </span>

                <span className="mt-2 text-[15px] font-bold text-gray-900">
                  {
                    item.value
                  }
                </span>
              </Link>
            ),
          )}
        </div>

        {/* 출석 현황 */}
        <section className="mt-2 rounded-2xl bg-[#F8F8F8] px-4 pb-5 pt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-gray-500">
                출석 현황
              </p>

              <div className="mt-1 flex items-end gap-1">
                <span className="text-[22px] font-extrabold text-[#31C66B]">
                  {attendanceCount}
                </span>

                <span className="pb-[2px] text-[12px] font-semibold text-gray-500">
                  /5
                </span>
              </div>
            </div>

            <p className="pb-1 text-[9px] text-[#31B76A]">
              {attendanceCount === 5
                ? '5일 모두 출석했어요!'
                : `${5 - attendanceCount}일 더 출석해보세요!`}
            </p>
          </div>

          <div className="mt-4 flex items-start justify-between">
            {Array.from(
              {
                length: 5,
              },
              (
                _,
                index,
              ) => {
                const active =
                  index <
                  attendanceCount

                return (
                  <div
                    key={
                      index
                    }
                    className="flex flex-col items-center"
                  >
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
                        'mt-1.5 text-[8px] font-medium ' +
                        (
                          active
                            ? 'text-[#31B76A]'
                            : 'text-gray-300'
                        )
                      }
                    >
                      {index + 1}일
                    </span>
                  </div>
                )
              },
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MyPage