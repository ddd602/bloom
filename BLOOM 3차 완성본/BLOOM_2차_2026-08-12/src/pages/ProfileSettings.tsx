import {
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import ScreenHeader from '../components/ScreenHeader'
import { IconPencil } from '../components/icons'

import {
  getOnboarding,
  type OnboardingData,
} from '../components/api/OnboardingApi'

import profileUrl from '../assets/brand/profile-yellow.svg'

const FOCUS_LABELS:
  Record<string, string> = {
  abdomen: '복부',
  upper: '상체 · 가슴',
  pelvis: '골반 · 힙',
  thigh: '허벅지',
}

const GOAL_SHORT_LABELS:
  Record<string, string> = {
  weight: '체중 감량',
  line: '라인 개선',
  health: '건강 회복',
  skin: '피부 개선',
}

function formatFullDate(
  key: string,
) {
  if (!key) {
    return '-'
  }

  const [
    year,
    month,
    day,
  ] =
    key.split('-')

  if (
    !year ||
    !month ||
    !day
  ) {
    return '-'
  }

  return `${Number(
    year,
  )}년 ${Number(
    month,
  )}월 ${Number(
    day,
  )}일`
}

function weeksSincePostpartum(
  dueDate: string,
) {
  if (!dueDate) {
    return null
  }

  const due =
    new Date(
      `${dueDate}T00:00:00`,
    )

  const today =
    new Date()

  const diffDays =
    Math.floor(
      (
        today.getTime() -
        due.getTime()
      ) /
        86400000,
    )

  if (diffDays < 0) {
    return null
  }

  return Math.floor(
    diffDays / 7,
  )
}

function ProfileSettings() {
  const navigate =
    useNavigate()

  const [
    onboarding,
    setOnboarding,
  ] =
    useState<
      OnboardingData | null
    >(null)

  useEffect(() => {
    const load =
      async () => {
        try {
          const data =
            await getOnboarding()

          setOnboarding(
            data,
          )
        } catch (error) {
          console.error(
            '온보딩 정보를 불러오지 못했습니다.',
            error,
          )
        }
      }

    void load()
  }, [])

  const focusLabel =
    FOCUS_LABELS[
      onboarding
        ?.focusAreas?.[0] ??
        ''
    ] ?? ''

  const goalLabel =
    GOAL_SHORT_LABELS[
      onboarding
        ?.goals?.[0] ??
        ''
    ] ?? ''

  const goalTag =
    [
      focusLabel,
      goalLabel,
    ]
      .filter(Boolean)
      .join(' ') ||
    '아직 설정한 목표가 없어요'

  const weeks =
    weeksSincePostpartum(
      onboarding?.dueDate ??
        '',
    )

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="내 정보 설정" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">

        {/* 프로필 */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full bg-[#F1F8F3]">
              <img
                src={
                  profileUrl
                }
                alt="프로필"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 shadow">
              <IconPencil className="h-3 w-3" />
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1">
            <p className="text-[13px] font-bold text-gray-900">
              사용자님
            </p>

            <IconPencil className="h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* 이용약관 */}
        <Link
          to="/my-page/terms"
          className="mt-5 block text-center text-[9px] text-gray-400 underline underline-offset-2"
        >
          이용약관
        </Link>

        {/* 관리 목표 */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3">
          <span className="rounded-full bg-[#31C66B] px-3 py-1 text-[10px] font-semibold text-white">
            {goalTag}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/my-page/goal-edit',
              )
            }
            className="shrink-0 rounded-full border border-[#31C66B] px-3 py-1 text-[9px] font-medium text-[#31B76A]"
          >
            수정하기
          </button>
        </div>

        {/* 기본 건강 정보 */}
        <p className="mt-7 text-[12px] font-bold text-gray-900">
          기본 건강 정보
        </p>

        <div className="mt-3 rounded-xl bg-[#EAF8EC] px-4 py-3">

          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-gray-900">
              사용자님{' '}
              {weeks != null
                ? `출산 ${weeks}주차`
                : ''}
            </p>

            <span className="text-[14px] leading-none text-gray-400">
              ⋮
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className="text-gray-500">
              생년월일
            </span>

            <span className="font-semibold text-gray-800">
              {formatFullDate(
                onboarding
                  ?.birthDate ??
                  '',
              )}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-gray-500">
              키 / 몸무게
            </span>

            <span className="font-semibold text-gray-800">
              {onboarding
                ? `${onboarding.height}cm / ${onboarding.weight}kg`
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings