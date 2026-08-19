import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  getAccessToken,
  reissueTokens,
  clearTokens,
} from '../components/api/AuthApi'

import cloverUrl from '../assets/brand/profile.svg'

export default function Splash() {
  const navigate =
    useNavigate()

  const [
    leaving,
    setLeaving,
  ] =
    useState(false)

  useEffect(() => {
    let cancelled =
      false

    const checkAuth =
      async () => {
        const minimumDelay =
          new Promise<void>(
            (resolve) => {
              setTimeout(
                resolve,
                1600,
              )
            },
          )

        let nextPath =
          '/welcome'

        const accessToken =
          getAccessToken()

        if (
          accessToken
        ) {
          try {
            await reissueTokens()

            nextPath =
              '/home'
          } catch (
            error
          ) {
            console.error(
              '로그인 세션을 확인하지 못했습니다.',
              error,
            )

            clearTokens()

            nextPath =
              '/welcome'
          }
        }

        await minimumDelay

        if (
          cancelled
        ) {
          return
        }

        setLeaving(
          true,
        )

        setTimeout(
          () => {
            if (
              !cancelled
            ) {
              navigate(
                nextPath,
                {
                  replace:
                    true,
                },
              )
            }
          },
          350,
        )
      }

    void checkAuth()

    return () => {
      cancelled =
        true
    }
  }, [navigate])

  return (
    <div
      className={
        'relative mx-auto flex h-[100dvh] w-full max-w-[390px] items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#F7FCF8] to-[#ECF8F0] transition-opacity duration-300 ' +
        (
          leaving
            ? 'opacity-0'
            : 'opacity-100'
        )
      }
    >
      {/* 배경 글로우 */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[280px]
          w-[280px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,#A7EDC0_0%,rgba(167,237,192,0.35)_40%,rgba(255,255,255,0)_72%)]
          blur-[12px]
        "
      />

      {/* 중앙 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="
            flex
            h-[118px]
            w-[118px]
            animate-[splashPop_700ms_cubic-bezier(0.22,1,0.36,1)_both]
            items-center
            justify-center
            rounded-full
            bg-white/70
            shadow-[0_14px_40px_rgba(49,198,107,0.15)]
            backdrop-blur-sm
          "
        >
          <img
            src={
              cloverUrl
            }
            alt="BLOOM"
            className="
              h-[92px]
              w-[92px]
              object-contain
            "
          />
        </div>

        <h1
          className="
            mt-5
            animate-[splashFadeUp_700ms_250ms_ease-out_both]
            text-[25px]
            font-black
            tracking-[0.18em]
            text-[#2DBB68]
          "
        >
          BLOOM
        </h1>

        <p
          className="
            mt-2
            animate-[splashFadeUp_700ms_400ms_ease-out_both]
            text-[9px]
            font-medium
            tracking-[0.06em]
            text-[#8AB39A]
          "
        >
          나를 위한 회복과 변화
        </p>
      </div>

      <style>
        {`
          @keyframes splashPop {
            0% {
              opacity: 0;
              transform: scale(0.82);
            }

            70% {
              opacity: 1;
              transform: scale(1.04);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes splashFadeUp {
            0% {
              opacity: 0;
              transform: translateY(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}