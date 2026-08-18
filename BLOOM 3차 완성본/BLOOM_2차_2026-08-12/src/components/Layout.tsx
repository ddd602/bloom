import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import manageActive from '../assets/icons/nav-manage-active.svg'
import manageInactive from '../assets/icons/nav-manage-inactive.svg'
import calendarActive from '../assets/icons/nav-calendar-active.svg'
import calendarInactive from '../assets/icons/nav-calendar-inactive.svg'
import homeActive from '../assets/icons/nav-home-active.svg'
import homeInactive from '../assets/icons/nav-home-inactive.svg'
import chatActive from '../assets/icons/nav-chat-active.svg'
import chatInactive from '../assets/icons/nav-chat-inactive.svg'
import mypageActive from '../assets/icons/nav-mypage-active.svg'
import mypageInactive from '../assets/icons/nav-mypage-inactive.svg'

type NavItem = {
  to: string
  label: string
  active: string
  inactive: string
}

const navItems: NavItem[] = [
  {
    to: '/manage',
    label: '관리',
    active: manageActive,
    inactive: manageInactive,
  },
  {
    to: '/calendar',
    label: '캘린더',
    active: calendarActive,
    inactive: calendarInactive,
  },
  {
    to: '/home',
    label: '홈',
    active: homeActive,
    inactive: homeInactive,
  },
  {
    to: '/ai-chat',
    label: 'AI 상담',
    active: chatActive,
    inactive: chatInactive,
  },
  {
    to: '/my-page',
    label: '마이페이지',
    active: mypageActive,
    inactive: mypageInactive,
  },
]

const itemClass = (active: boolean) =>
  'flex flex-1 flex-col items-center gap-1 text-[10px] transition-colors ' +
  (active
    ? 'font-medium text-[#31664C]'
    : 'font-normal text-[#7D7D7D]')

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  const onCalendar = location.pathname === '/calendar'
  const onWeekly = location.pathname === '/weeklyCalendar'

  const toggleCalendar = () => {
    if (onCalendar) {
      navigate('/weeklyCalendar')
    } else {
      navigate('/calendar')
    }
  }

  return (
    <div
      className="mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-white shadow-sm"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <main
        className={
          'min-h-0 flex-1 overflow-y-auto ' +
          (location.pathname === '/home'
            ? ''
            : 'pt-4')
        }
      >
        <Outlet />
      </main>

      <div className="shrink-0 bg-white">
        <nav className="flex h-[64px] items-center justify-around border-t border-gray-100 px-2">
          {navItems.map(({ to, label, active, inactive }) => {
            if (to === '/calendar') {
              const isActive = onCalendar || onWeekly

              return (
                <button
                  key={to}
                  type="button"
                  onClick={toggleCalendar}
                  className={itemClass(isActive)}
                >
                  <img
                    src={isActive ? active : inactive}
                    alt=""
                    className="h-6 w-6"
                  />

                  <span>{label}</span>
                </button>
              )
            }

            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  itemClass(isActive)
                }
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? active : inactive}
                      alt=""
                      className="h-6 w-6"
                    />

                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex justify-center pb-2 pt-1">
          <div className="h-1 w-32 rounded-full bg-gray-900" />
        </div>
      </div>
    </div>
  )
}

export default Layout