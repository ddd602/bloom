import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  getLatestNudeBodyPhoto,
  type NudeBodyPhoto,
} from '../api/NudeBodyApi'

import { IconChevronRight } from '../icons'

function NudeBodySection({ to }: { to: string }) {
  const navigate = useNavigate()

  const [latest, setLatest] =
    useState<NudeBodyPhoto | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadPhoto = async () => {
      try {
        const result =
          await getLatestNudeBodyPhoto()

        if (!cancelled) {
          setLatest(result)
        }
      } catch (error) {
        console.error(
          '눈바디 사진을 불러오지 못했습니다.',
          error,
        )
      }
    }

    void loadPhoto()

    return () => {
      cancelled = true
    }
  }, [])

  const handleOpenCamera = () => {
    navigate(to, {
      state: {
        openCamera: true,
      },
    })
  }

  return (
    <section>
      <Link
        to={to}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-[14px] font-bold text-gray-900">
            AI 눈바디 변화 측정
          </h2>

          <p className="mt-1 text-[8px] text-gray-400">
            눈바디 사진을 기록하고 변화 과정을 확인해보세요
          </p>
        </div>

        <IconChevronRight className="h-6 w-6 text-gray-400" />
      </Link>

      <div className="mt-4 flex justify-center">
        <div className="flex w-full max-w-[220px] flex-col items-center">
          <button
            type="button"
            onClick={handleOpenCamera}
            className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-lg bg-[#CFCFCF] text-white"
            aria-label="눈바디 촬영하기"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
              <circle cx="12" cy="13" r="3.2" />
            </svg>

            <span className="mt-2 text-center text-[8px] leading-[11px] text-white/80">
              이주의 눈바디를
              <br />
              촬영해 주세요!
            </span>
          </button>

          <p className="mt-2 text-[10px] font-bold text-gray-900">
            현재 눈바디
          </p>

          <p className="mt-0.5 text-[8px] text-gray-400">
            {latest
              ? '최근 눈바디가 저장되어 있어요'
              : '눈바디를 촬영해 주세요'}
          </p>
        </div>
      </div>
    </section>
  )
}

export default NudeBodySection