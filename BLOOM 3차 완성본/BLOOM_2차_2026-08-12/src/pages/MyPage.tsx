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
  IconBell,
  IconChevronRight,
} from '../components/icons'

import loginLogoUrl from '../assets/brand/login-logo.svg'
import profileUrl from '../assets/brand/profile.svg'

const menus = [
  {
    label: '공지/이벤트',
    to: '/my-page/notice',
  },
  {
    label: '스토어 및 시술 예약',
    to: '/my-page/store',
  },
  {
    label: 'AI 대화체 설정',
    to: '/my-page/ai-style',
  },
  {
    label: '캐릭터 설정',
    to: '/my-page/character',
  },
  {
    label: '고객센터',
    to: '/my-page/support',
  },
  {
    label: '자주 묻는 질문',
    to: '/my-page/faq',
  },
  {
    label: '1:1 상담',
    to: '/my-page/inquiry',
  },
  {
    label: '약관 및 정책',
    to: '/my-page/terms',
  },
]

function maskEmail(email: string) {
  if (!email) return ''

  const [local, domain] =
    email.split('@')

  if (!domain) {
    return email
  }

  if (local.length <= 2) {
    return `${local[0] ?? ''}***@${domain}`
  }

  return `${local.slice(0, 2)}***@${domain}`
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
    loading,
    setLoading,
  ] = useState(true)

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const data =
            await getProfile()

          setProfile(
            data,
          )
        } catch (error) {
          console.error(
            '프로필을 불러오지 못했습니다.',
            error,
          )
        } finally {
          setLoading(
            false,
          )
        }
      }

    loadProfile()
  }, [])

  const handleLogout =
    async () => {
      try {
        await logout()
      } catch (error) {
        console.error(
          '로그아웃 중 오류가 발생했습니다.',
          error,
        )
      } finally {
        navigate(
          '/login',
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
        '-',
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
        {/* 상단 로고 + 알림 */}
        <div className="mb-6 flex items-center justify-between">
          <img
            src={loginLogoUrl}
            alt="BLOOM"
            className="
              h-[28px]
              w-auto
              object-contain
            "
          />

          <button
            type="button"
            aria-label="알림"
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              text-gray-600
            "
          >
            <IconBell className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* 프로필 */}
        <div className="mb-5 flex items-center">
          <div
            className="
              flex
              h-[58px]
              w-[58px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[#F1F8F3]
            "
          >
            <img
              src={profileUrl}
              alt="프로필"
              className="
                h-full
                w-full
                object-cover
              "
            />
          </div>

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
              handleLogout
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

        {/* 현재 플랜 */}
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

        {/* 사용자 요약 */}
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

        {/* 메뉴 */}
        <ul>
          {menus.map(
            (menu) => (
              <li
                key={
                  menu.to
                }
              >
                <Link
                  to={
                    menu.to
                  }
                  className="
                    flex
                    min-h-[38px]
                    w-full
                    items-center
                    justify-between
                    text-left
                    text-[10px]
                    font-medium
                    text-gray-700
                  "
                >
                  <span>
                    {
                      menu.label
                    }
                  </span>

                  <IconChevronRight
                    className="
                      h-4
                      w-4
                      text-gray-300
                    "
                  />
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  )
}

export default MyPage