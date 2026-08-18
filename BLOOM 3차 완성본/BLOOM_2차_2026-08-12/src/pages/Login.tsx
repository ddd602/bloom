import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  login,
} from '../components/api/AuthApi'

import {
  IconChevronLeft,
} from '../components/icons'

import loginBgUrl from '../assets/brand/login-bg.svg'
import loginLogoUrl from '../assets/brand/login-logo.svg'

export default function Login() {
  const navigate = useNavigate()

  const [showLoginForm, setShowLoginForm] = useState(false)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const valid =
    id.trim() !== '' &&
    pw.trim() !== ''

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (!valid || loading) return

    try {
      setLoading(true)
      setError('')

      await login({
        email: id.trim(),
        password: pw,
      })

      navigate('/home', {
        replace: true,
      })
    } catch (error) {
      if (error instanceof Error) {
        setError(
          error.message,
        )
      } else {
        setError(
          '로그인에 실패했습니다.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const openLoginForm = () => {
    setError('')
    setShowLoginForm(true)
  }

  const closeLoginForm = () => {
    setError('')
    setPw('')
    setShowLoginForm(false)
  }

  // ============================
  // 로그인 입력 화면
  // ============================

  if (showLoginForm) {
    return (
      <div className="mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col bg-white">

        <header
          className="shrink-0 px-5"
          style={{
            paddingTop:
              'calc(env(safe-area-inset-top) + 16px)',
          }}
        >
          <button
            type="button"
            onClick={
              closeLoginForm
            }
            aria-label="뒤로가기"
            className="flex h-7 w-7 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 px-7 pt-6">

          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            로그인
          </h1>

          <form
            onSubmit={
              submit
            }
            className="space-y-3"
          >

            <input
              value={
                id
              }
              onChange={(e) => {
                setId(
                  e.target.value,
                )
                setError('')
              }}
              type="email"
              placeholder="아이디 (이메일)"
              className="w-full rounded-xl bg-gray-100 px-4 py-3.5 text-sm outline-none placeholder:text-gray-400"
            />

            <div className="flex items-center rounded-xl bg-gray-100 px-4">

              <input
                value={
                  pw
                }
                onChange={(e) => {
                  setPw(
                    e.target.value,
                  )
                  setError('')
                }}
                type={
                  showPw
                    ? 'text'
                    : 'password'
                }
                placeholder="비밀번호"
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPw(
                    (v) => !v,
                  )
                }
                aria-label="비밀번호 표시"
                className="pl-2 text-gray-400"
              >
                {showPw
                  ? '🙈'
                  : '👁'}
              </button>

            </div>

            {error && (
              <p className="px-1 pt-1 text-[11px] text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                !valid ||
                loading
              }
              className={
                'mt-5 w-full rounded-2xl py-4 text-[15px] font-semibold transition-colors ' +
                (
                  valid &&
                  !loading
                    ? 'bg-[#33C16A] text-white'
                    : 'bg-gray-200 text-gray-400'
                )
              }
            >
              {loading
                ? '로그인 중...'
                : '로그인 하기'}
            </button>

          </form>

        </div>
      </div>
    )
  }

  // ============================
  // BLOOM 시작 화면
  // ============================

  return (
    <div className="relative mx-auto h-[100dvh] w-full max-w-[390px] overflow-hidden bg-[#F7FFF9]">

      {/* 배경 클로버 */}
      <img
        src={
          loginBgUrl
        }
        alt=""
        className="
          pointer-events-none
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* BLOOM 로고 */}
      <img
        src={
          loginLogoUrl
        }
        alt="BLOOM"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-10
          w-[200px]
          max-w-none
          -translate-x-1/2
          -translate-y-1/2
          object-contain
        "
      />

      {/* 하단 버튼 */}
      <div
        className="
          absolute
          bottom-[28px]
          left-0
          right-0
          z-20
          px-[40px]
        "
        style={{
          paddingBottom:
            'env(safe-area-inset-bottom)',
        }}
      >

        <button
          type="button"
          onClick={() =>
            navigate(
              '/signup',
            )
          }
          className="
            flex
            h-[46px]
            w-full
            items-center
            justify-center
            gap-1.5
            rounded-full
            bg-[#31C86B]
            text-[11px]
            font-semibold
            text-white
          "
        >
          <span className="text-[12px]">
            ✉
          </span>

          이메일로 가입하기
        </button>

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-3
            whitespace-nowrap
            text-[10px]
          "
        >
          <span className="text-gray-400">
            이미 BLOOM 회원이신가요?
          </span>

          <button
            type="button"
            onClick={
              openLoginForm
            }
            className="
              font-semibold
              text-gray-700
              underline
              decoration-gray-500
              underline-offset-2
            "
          >
            로그인 하기
          </button>
        </div>

      </div>
    </div>
  )
}