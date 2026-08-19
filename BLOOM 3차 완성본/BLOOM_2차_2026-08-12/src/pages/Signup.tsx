import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  signup,
} from '../components/api/AuthApi'

import {
  IconChevronLeft,
  IconChevronDown,
  IconMail,
  IconLock,
  IconProfile,
  IconEye,
  IconEyeOff,
} from '../components/icons'

export default function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const valid =
    email.trim() !== '' &&
    pw.trim() !== '' &&
    name.trim() !== ''

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (!valid || loading) return

    try {
      setLoading(true)
      setError('')

      await signup({
        email: email.trim(),
        password: pw,
        nickname: name.trim(),
      })

      navigate('/login', {
        replace: true,
        state: {
          openLoginForm: true,
        },
      })
    } catch (error) {
      console.error(
        '회원가입 실패:',
        error,
      )

      if (error instanceof Error) {
        setError(
          error.message,
        )
      } else {
        setError(
          '회원가입에 실패했습니다.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col bg-white">

      {/* 뒤로가기 */}
      <header
        className="shrink-0 px-5"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="뒤로가기"
          className="flex h-7 w-7 items-center justify-center text-[#777]"
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>
      </header>

      {/* 회원가입 */}
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pt-10">

        <h1 className="mb-6 text-[18px] font-bold text-[#111]">
          회원가입
        </h1>

        <form
          id="signup-form"
          onSubmit={submit}
          className="space-y-[6px]"
        >

          {/* 이메일 */}
          <div className="flex h-[46px] items-center rounded-[5px] bg-[#F7F7F7] px-3">

            <IconMail className="h-[16px] w-[16px] shrink-0 text-[#777]" />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(
                  e.target.value,
                )
                setError('')
              }}
              placeholder="email@example.com"
              className="ml-3 min-w-0 flex-1 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-[#777]"
            />

          </div>

          {/* 비밀번호 */}
          <div className="flex h-[46px] items-center rounded-[5px] bg-[#F7F7F7] px-3">

            <IconLock className="h-[16px] w-[16px] shrink-0 text-[#777]" />

            <input
              type={
                showPw
                  ? 'text'
                  : 'password'
              }
              value={pw}
              onChange={(e) => {
                setPw(
                  e.target.value,
                )
                setError('')
              }}
              placeholder="비밀번호를 입력해주세요"
              className="ml-3 min-w-0 flex-1 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-[#777]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPw(
                  (v) => !v,
                )
              }
              aria-label="비밀번호 표시"
              className="ml-2 flex h-6 w-6 items-center justify-center text-[#777]"
            >
              {showPw ? (
                <IconEye className="h-[17px] w-[17px]" />
              ) : (
                <IconEyeOff className="h-[17px] w-[17px]" />
              )}
            </button>

          </div>

          {/* 이름 */}
          <div className="flex h-[46px] items-center rounded-[5px] bg-[#F7F7F7] px-3">

            <IconProfile className="h-[16px] w-[16px] shrink-0 text-[#777]" />

            <input
              value={name}
              onChange={(e) => {
                setName(
                  e.target.value,
                )
                setError('')
              }}
              placeholder="이름을 입력해주세요"
              className="ml-3 min-w-0 flex-1 bg-transparent text-[10px] text-gray-700 outline-none placeholder:text-[#777]"
            />

          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="px-1 pt-2 text-[9px] text-red-500">
              {error}
            </p>
          )}

        </form>
      </main>

      {/* 약관 */}
      <footer
        className="shrink-0 border-t border-[#F1F1F1] bg-white px-5 pt-3"
        style={{
          paddingBottom:
            'calc(env(safe-area-inset-bottom) + 16px)',
        }}
      >

        <div className="mb-3 flex items-center justify-between">

          <div>
            <p className="text-[9px] font-bold text-[#222]">
              BLOOM 이용 약관
            </p>

            <p className="mt-[2px] text-[6px] text-gray-400">
              회원가입을 위해 이용약관 및 개인정보 처리방침에 동의해주세요
            </p>
          </div>

          <IconChevronDown className="h-[15px] w-[15px] text-[#555]" />

        </div>

        <button
          type="submit"
          form="signup-form"
          disabled={
            !valid ||
            loading
          }
          className={
            'h-[46px] w-full rounded-full text-[11px] font-semibold transition-colors ' +
            (
              valid &&
              !loading
                ? 'bg-[#31C66B] text-white'
                : 'bg-[#BDBDBD] text-white'
            )
          }
        >
          {loading
            ? '회원가입 중...'
            : '동의하고 회원가입 하기'}
        </button>

      </footer>
    </div>
  )
}