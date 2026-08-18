import {
  Link,
  useNavigate,
} from 'react-router-dom'

import logoUrl from '../assets/brand/login-logo.svg'
import bgUrl from '../assets/brand/login-bg.svg'

export default function Welcome() {
  const navigate =
    useNavigate()

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-gradient-to-b from-[#EAF8EE] to-white px-7">

      {/* 배경 로고 */}
      <img
        src={bgUrl}
        alt=""
        className="pointer-events-none absolute left-1/2 top-16 w-[320px] -translate-x-1/2 opacity-[0.07]"
      />

      {/* 로고 */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <img
          src={logoUrl}
          alt="BLOOM"
          className="w-44"
        />
      </div>

      {/* 버튼 영역 */}
      <div className="pb-10">

        <button
          type="button"
          onClick={() =>
            navigate('/signup')
          }
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#33C16A] py-4 text-[15px] font-semibold text-white"
        >
          이메일로 회원가입
        </button>

        <p className="mt-6 text-center text-[13px] text-gray-400">
          이미 BLOOM 회원이신가요?{' '}

          <Link
            to="/login"
            className="font-semibold text-gray-700 underline"
          >
            로그인
          </Link>
        </p>

      </div>
    </div>
  )
}