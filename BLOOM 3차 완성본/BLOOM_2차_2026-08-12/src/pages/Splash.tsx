import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getAccessToken,
  reissueTokens,
  clearTokens,
} from '../components/api/AuthApi'

import cloverUrl from '../assets/brand/profile.svg'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    const checkAuth = async () => {
      const delay = new Promise<void>((resolve) => {
        setTimeout(resolve, 1200)
      })

      let nextPath = '/welcome'

      const accessToken = getAccessToken()

      if (accessToken) {
        try {
          await reissueTokens()
          nextPath = '/home'
        } catch (error) {
          console.error(
            '로그인 세션을 확인하지 못했습니다.',
            error,
          )

          clearTokens()
          nextPath = '/welcome'
        }
      }

      await delay

      if (!cancelled) {
        navigate(nextPath, {
          replace: true,
        })
      }
    }

    void checkAuth()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col items-center justify-center bg-gradient-to-b from-white to-[#F2FAF4]">
      <img
        src={cloverUrl}
        alt="BLOOM"
        className="h-24 w-24"
      />
    </div>
  )
}