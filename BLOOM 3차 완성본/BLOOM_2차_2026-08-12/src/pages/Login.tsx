import { useState } from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  login,
} from '../components/api/AuthApi'

import {
  getProfile,
} from '../components/api/OnboardingApi'

import {
  IconChevronLeft,
} from '../components/icons'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

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

      const profile =
        await getProfile()

      if (
        profile.onboardingCompleted
      ) {
        navigate('/home', {
          replace: true,
        })
      } else {
        navigate('/onboarding', {
          replace: true,
        })
      }
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

  const handleBack = () => {
    setError('')
    setPw('')

    navigate('/welcome', {
      replace: true,
    })
  }

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
          onClick={handleBack}
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
          onSubmit={submit}
          className="space-y-3"
        >

          <input
            value={id}
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
              value={pw}
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