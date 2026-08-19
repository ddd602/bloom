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
    <div
      className="
        relative
        mx-auto
        flex
        h-[100dvh]
        w-full
        max-w-[390px]
        flex-col
        overflow-hidden
        bg-gradient-to-b
        from-[#EAF8EE]
        to-white
        px-7
      "
    >
      {/* 배경 큰 클로버 */}
      <img
        src={bgUrl}
        alt=""
        className="
          pointer-events-none
          absolute
          left-1/2
          top-12
          w-[330px]
          -translate-x-1/2
          animate-[welcomeBg_800ms_ease-out_both]
          opacity-[0.08]
        "
      />

      {/* 중앙 로고 */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <img
          src={logoUrl}
          alt="BLOOM"
          className="
            w-44
            animate-[welcomeLogo_650ms_150ms_ease-out_both]
          "
        />
      </div>

      {/* 버튼 영역 */}
      <div
        className="
          relative
          z-10
          pb-10
          animate-[welcomeFadeUp_650ms_250ms_ease-out_both]
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate('/signup')
          }
          className="
            mb-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#33C16A]
            py-4
            text-[15px]
            font-semibold
            text-white
            transition-transform
            active:scale-[0.98]
          "
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

      <style>
        {`
          @keyframes welcomeBg {
            0% {
              opacity: 0;
              transform:
                translateX(-50%)
                scale(1.08);
            }

            100% {
              opacity: 0.08;
              transform:
                translateX(-50%)
                scale(1);
            }
          }

          @keyframes welcomeLogo {
            0% {
              opacity: 0;
              transform:
                translateY(10px)
                scale(0.97);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          @keyframes welcomeFadeUp {
            0% {
              opacity: 0;
              transform:
                translateY(12px);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}