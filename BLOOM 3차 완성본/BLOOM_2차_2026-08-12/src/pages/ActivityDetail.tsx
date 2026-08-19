import {
  useEffect,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import DailyExerciseRecord from '../components/Manage/DailyExerciseRecord'

import {
  getDailyDiary,
  type DailyDiaryResponse,
} from '../components/api/DiaryApi'

import {
  IconChevronLeft,
} from '../components/icons'

const ACTIVITY_GOAL = 450

function getTodayDate() {
  const today = new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      today.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}

export default function ActivityDetail() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const selectedDate =
    location.state?.selectedDate ??
    getTodayDate()

  const [
    diary,
    setDiary,
  ] =
    useState<
      DailyDiaryResponse | null
    >(null)

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  // ==========================
  // 선택한 날짜 활동량 조회
  //
  // 서버 DailyDiaryResponse의
  // 계산된 합계를 사용
  // ==========================

  useEffect(() => {
    const loadData =
      async () => {
        try {
          setLoading(true)

          const result =
            await getDailyDiary(
              selectedDate,
            )

          setDiary(
            result,
          )
        } catch (error) {
          console.error(
            '활동량 데이터를 불러오지 못했습니다.',
            error,
          )

          setDiary(
            null,
          )
        } finally {
          setLoading(
            false,
          )
        }
      }

    loadData()
  }, [
    selectedDate,
  ])

  // ==========================
  // 서버 계산 결과
  // ==========================

  const totalBurnedKcal =
    diary?.totalBurnedKcal ??
    0

  const totalSteps =
    diary?.totalSteps ??
    0

  const totalExerciseMinutes =
    diary?.totalExerciseMinutes ??
    0

  const burnedKcalChange =
    diary?.burnedKcalChange ??
    null

  // ==========================
  // 활동 목표 진행률
  // ==========================

  const pct =
    Math.min(
      100,
      Math.round(
        (
          totalBurnedKcal /
          ACTIVITY_GOAL
        ) *
          100,
      ),
    )

  const hasData =
    totalBurnedKcal > 0 ||
    totalSteps > 0 ||
    totalExerciseMinutes > 0

  return (
    <div className="flex h-full flex-col bg-white">

      {/* 헤더 */}
      <header
        className="shrink-0 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-gray-900">
            일일 활동량 세부 기록
          </h1>

        </div>
      </header>

      {/* 본문 */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 pb-6 pt-7">

        {/* 일일 활동량 */}
        <section>

          <p className="text-sm font-bold text-gray-900">
            일일 활동량
          </p>

          <p className="mt-1 flex items-baseline gap-1">

            <span className="text-3xl font-extrabold text-green-600">
              {totalBurnedKcal.toLocaleString()}
            </span>

            <span className="text-lg font-bold text-green-600">
              kcal
            </span>

            <span className="ml-1 text-sm text-gray-400">
              / {ACTIVITY_GOAL} kcal
            </span>

          </p>

          <p className="mt-1 text-xs text-gray-400">

            {loading ? (
              '활동 기록을 불러오는 중이에요'
            ) : !hasData ? (
              '아직 오늘 활동 기록이 없어요'
            ) : burnedKcalChange ===
              null ? (
              '어제 기록이 없어요'
            ) : burnedKcalChange >
              0 ? (
              <>
                어제보다{' '}

                <span className="font-semibold text-[#20B970]">
                  {burnedKcalChange.toLocaleString()}{' '}
                  kcal
                </span>{' '}

                더 움직였어요!
              </>
            ) : burnedKcalChange <
              0 ? (
              <>
                어제보다{' '}

                <span className="font-semibold text-[#20B970]">
                  {Math.abs(
                    burnedKcalChange,
                  ).toLocaleString()}{' '}
                  kcal
                </span>{' '}

                덜 움직였어요
              </>
            ) : (
              '어제와 활동량이 같아요'
            )}

          </p>

        </section>

        {/* 활동 요약 */}
        <section className="rounded-[5px] bg-gray-100 p-4">

          <p className="mb-4 text-sm font-bold text-gray-900">
            오늘의 활동
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* 운동 시간 */}
            <div className="rounded-[5px] bg-white px-4 py-4">

              <p className="text-[10px] text-gray-400">
                운동 시간
              </p>

              <p className="mt-1">

                <span className="text-xl font-extrabold text-gray-900">
                  {totalExerciseMinutes.toLocaleString()}
                </span>

                <span className="ml-1 text-[11px] text-gray-500">
                  분
                </span>

              </p>

            </div>

            {/* 소모 칼로리 */}
            <div className="rounded-[5px] bg-white px-4 py-4">

              <p className="text-[10px] text-gray-400">
                소모 칼로리
              </p>

              <p className="mt-1">

                <span className="text-xl font-extrabold text-[#31C66B]">
                  {totalBurnedKcal.toLocaleString()}
                </span>

                <span className="ml-1 text-[11px] text-[#31C66B]">
                  kcal
                </span>

              </p>

            </div>

          </div>

          {/* 목표 진행 바 */}
          <div className="mt-4">

            <div className="mb-1 flex justify-end">

              <span className="text-[10px] text-gray-400">
                {pct}% Goal
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width:
                    `${pct}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* 일일 걸음 수 */}
        <section className="rounded-[5px] bg-gray-100 p-4">

          <p className="mb-2 text-sm font-bold text-gray-900">
            일일 걸음 수
          </p>

          <p className="flex items-baseline">

            <span className="text-2xl font-extrabold text-gray-900">
              {totalSteps.toLocaleString()}
            </span>

            <span className="ml-1 text-sm text-gray-500">
              걸음
            </span>

          </p>

        </section>

        {/* 일일 운동 기록 */}
        <section>

          <DailyExerciseRecord
            date={
              selectedDate
            }
          />

          <button
            type="button"
            onClick={() =>
              navigate(
                '/manage/exercise',
              )
            }
            className="mt-2 w-full rounded-2xl bg-gray-100 py-3 text-sm text-gray-500"
          >
            + 운동 기록 만들러 가기
          </button>

        </section>

      </div>
    </div>
  )
}