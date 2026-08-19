// 화면에서 쓰는 선(line) 아이콘 모음. 색은 currentColor를 따라갑니다.
type IconProps = {
  className?: string
  strokeWidth?: number
}

const base = (p: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: p.strokeWidth ?? 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: p.className,
})

// 새로 추가: 로고 마크
export function IconLogo({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#35C878"
      className={className}
    >
      <g transform="rotate(45 12 12)">
        <circle cx="12" cy="7" r="4.4" />
        <circle cx="12" cy="17" r="4.4" />
        <circle cx="7" cy="12" r="4.4" />
        <circle cx="17" cy="12" r="4.4" />
      </g>

      <circle
        cx="12"
        cy="12"
        r="2.2"
        fill="#2BA968"
      />
    </svg>
  )
}

// 새로 추가: 관리(아령)
export function IconDumbbell(p: IconProps) {
  return (
    <svg {...base(p)}>
      <g transform="rotate(-45 12 12)">
        <path d="M9.5 12h5" />
        <path d="M9.5 8.5v7" />
        <path d="M14.5 8.5v7" />
        <path d="M7 9.8v4.4" />
        <path d="M17 9.8v4.4" />
      </g>
    </svg>
  )
}

// 하단 탭: 관리(사람 1명)
export function IconUser(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.3 3.2-5 6.5-5s5.9 1.7 6.5 5" />
    </svg>
  )
}

// 하단 탭: 캘린더
export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9h17M8 3v3M16 3v3" />
      <circle cx="8.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

// 하단 탭: 홈
export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
    </svg>
  )
}

// 변경: AI 상담 새 말풍선 아이콘
export function IconChat(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="7"
        rx="3.4"
      />
      <rect
        x="9"
        y="8"
        width="11"
        height="7"
        rx="3.4"
      />
      <path d="M14 15v2.3l-2-2.3" />
    </svg>
  )
}

// 하단 탭: 마이페이지(사람 2명)
export function IconUsers(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="9" cy="8" r="2.8" />
      <path d="M3.5 18.5c.5-2.9 2.7-4.5 5.5-4.5s5 1.6 5.5 4.5" />
      <path d="M16 5.5a2.8 2.8 0 0 1 0 5.4M17.5 14c2.2.4 3.7 1.9 4 4.5" />
    </svg>
  )
}

// 홈 헤더: 알림 종
export function IconBell(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  )
}

// 캘린더 헤더: 목록/체크리스트
export function IconChecklist(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6.5l1.6 1.6L8.5 5" />
      <path d="M4 13l1.6 1.6L8.5 11.5" />
      <path d="M4 19.5l1.6 1.6L8.5 18" />
      <path d="M11.5 6.5H21M11.5 13H21M11.5 19.5H20" />
    </svg>
  )
}

// 체크 원
export function IconCheckCircle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.2 2.2 4.8-5" />
    </svg>
  )
}

// 연필
export function IconPencil(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4.5 19.5 8 18.7 18.2 8.5a2 2 0 0 0 0-2.8l-.9-.9a2 2 0 0 0-2.8 0L4.3 15Z" />
      <path d="m13.5 5.8 4.7 4.7" />
    </svg>
  )
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...base(p)} viewBox="0 0 24 24">
      <path
        d="M16 20l-8-8 8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconTriangleDown(p: IconProps) {
  return (
    <svg {...base(p)} viewBox="0 0 24 24">
      <path
        d="M8.5 10.5h7l-3.5 4z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconChevronDown(p: IconProps) {
  return (
    <svg {...base(p)} viewBox="0 0 24 24">
      <path
        d="M5 8l7 7 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChevronUp(p: IconProps) {
  return (
    <svg {...base(p)} viewBox="0 0 24 24">
      <path
        d="M5 16l7-7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChevronRight({
  className = '',
}: {
  className?: string
}) {
  return (
    <IconChevronLeft
      className={`${className} rotate-180`}
    />
  )
}
export function IconMail(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  )
}

export function IconLock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function IconProfile(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 19c.5-3 2.6-5 5.5-5s5 2 5.5 5" />
    </svg>
  )
}

export function IconPhone(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10 5h4M11 18.5h2" />
    </svg>
  )
}

export function IconEye(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.3" />
    </svg>
  )
}

export function IconEyeOff(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.3" />
      <path d="M3.5 20.5 20.5 3.5" />
    </svg>
  )
}