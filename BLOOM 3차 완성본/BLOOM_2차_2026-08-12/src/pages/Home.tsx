import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  IconChevronRight,
} from '../components/icons'

import {
  getActivityByDate,
} from '../components/api/ActivityApi'

import {
  getExerciseStreak,
} from '../components/api/ExerciseApi'

import {
  getMealsByDate,
  mealCalories,
} from '../components/api/MealApi'

import {
  getGoal,
} from '../components/api/GoalApi'

import {
  getAiReport,
  type AiReportData,
} from '../components/api/AiReportApi'

import characterUrl from '../assets/brand/character.svg'

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

function Home() {
  const navigate =
    useNavigate()

  const [
    burnedCalories,
    setBurnedCalories,
  ] = useState(0)

  const [
    remainingCalories,
    setRemainingCalories,
  ] =
    useState<
      number | null
    >(null)

  const [
    routineStreak,
    setRoutineStreak,
  ] = useState(0)

  const [
    aiReport,
    setAiReport,
  ] =
    useState<
      AiReportData | null
    >(null)

  const [
    aiReportLoading,
    setAiReportLoading,
  ] = useState(true)

  const [
    aiReportError,
    setAiReportError,
  ] = useState('')

  useEffect(() => {
    const loadHomeStats =
      async () => {
        try {
          const today =
            getTodayDate()

          const [
            activity,
            meal,
            goal,
            streak,
          ] =
            await Promise.all([
              getActivityByDate(
                today,
              ),
              getMealsByDate(
                today,
              ),
              getGoal(),
              getExerciseStreak(),
            ])

          setRoutineStreak(
            streak,
          )

          setBurnedCalories(
            activity.kcal,
          )

          const breakfastCalories =
            mealCalories(
              meal.meals
                .breakfast
                .items,
            )

          const lunchCalories =
            mealCalories(
              meal.meals
                .lunch
                .items,
            )

          const dinnerCalories =
            mealCalories(
              meal.meals
                .dinner
                .items,
            )

          const eatenCalories =
            breakfastCalories +
            lunchCalories +
            dinnerCalories

          if (
            goal.dailyCalorieGoal !==
            null
          ) {
            const remaining =
              goal.dailyCalorieGoal -
              eatenCalories

            setRemainingCalories(
              Math.max(
                0,
                remaining,
              ),
            )
          } else {
            setRemainingCalories(
              null,
            )
          }
        } catch (error) {
          console.error(
            '홈 데이터를 불러오지 못했습니다.',
            error,
          )

          setBurnedCalories(
            0,
          )

          setRemainingCalories(
            null,
          )

          setRoutineStreak(
            0,
          )
        }
      }

    loadHomeStats()
  }, [])

  useEffect(() => {
    const loadAiReport =
      async () => {
        setAiReportLoading(true)
        setAiReportError('')

        try {
          const data =
            await getAiReport()

          setAiReport(
            data,
          )
        } catch (error) {
          console.error(
            'AI 분석 리포트를 불러오지 못했습니다.',
            error,
          )

          setAiReport(null)
          setAiReportError(
            'AI 분석 리포트를 불러오지 못했어요.',
          )
        } finally {
          setAiReportLoading(false)
        }
      }

    loadAiReport()
  }, [])

  const homeReport =
    aiReport
      ? [
          {
            label:
              '관리 목표',
            heading:
              aiReport
                .priority[0]
                ?.heading ??
              '맞춤 관리 목표',
            body:
              aiReport
                .priority[0]
                ?.body ?? '',
          },
          {
            label:
              '추천 운동',
            heading:
              aiReport
                .method[0]
                ?.heading ??
              '맞춤 운동 관리',
            body:
              aiReport
                .method[0]
                ?.body ?? '',
          },
          {
            label:
              '추천 식단',
            heading:
              aiReport
                .method[1]
                ?.heading ??
              '맞춤 식단 관리',
            body:
              aiReport
                .method[1]
                ?.body ?? '',
          },
          {
            label:
              '추천 케어',
            heading:
              aiReport
                .method[2]
                ?.heading ??
              '맞춤 생활 관리',
            body:
              aiReport
                .method[2]
                ?.body ?? '',
          },
        ]
      : []

  const stats = [
    {
      label:
        '루틴지속일',
      value:
        `D+${routineStreak}`,
      unit:
        '',
    },
    {
      label:
        '소모 칼로리',
      value:
        burnedCalories
          .toLocaleString(),
      unit:
        'kcal',
    },
    {
      label:
        '잔여 섭취 칼로리',
      value:
        remainingCalories ===
        null
          ? '-'
          : remainingCalories
              .toLocaleString(),
      unit:
        remainingCalories ===
        null
          ? ''
          : 'kcal',
    },
  ]

  const COLLAPSED_VISIBLE =
    108

  const [
    offset,
    setOffset,
  ] = useState(0)

  const [
    current,
    setCurrent,
  ] = useState(0)

  const [
    dragging,
    setDragging,
  ] =
    useState(false)

  const startY =
    useRef<
      number | null
    >(null)

  const startOffset =
    useRef(0)

  const currentRef =
    useRef(0)

  const minOffsetRef =
    useRef(0)

  const maxOffsetRef =
    useRef(0)

  const homeRef =
    useRef<HTMLElement>(
      null,
    )

  const statsRef =
    useRef<HTMLDivElement>(
      null,
    )

  const glowRef =
    useRef<HTMLDivElement>(
      null,
    )

  const sheetRef =
    useRef<HTMLElement>(
      null,
    )

  useEffect(() => {
    const calculateSheetPosition =
      () => {
        const home =
          homeRef.current

        const stats =
          statsRef.current

        const glow =
          glowRef.current

        const sheet =
          sheetRef.current

        if (
          !home ||
          !stats ||
          !glow ||
          !sheet
        ) {
          return
        }

        const homeRect =
          home.getBoundingClientRect()

        const statsRect =
          stats.getBoundingClientRect()

        const glowRect =
          glow.getBoundingClientRect()

        const sheetBaseTop =
          home.clientHeight -
          sheet.offsetHeight

        const maxUpTop =
          statsRect.bottom -
          homeRect.top +
          14

        const minOffset =
          Math.max(
            0,
            maxUpTop -
              sheetBaseTop,
          )

        const initialTop =
          glowRect.bottom -
          homeRect.top +
          12

        const initialOffset =
          initialTop -
          sheetBaseTop

        const maxOffset =
          Math.max(
            minOffset,
            sheet.offsetHeight -
              COLLAPSED_VISIBLE,
          )

        minOffsetRef.current =
          minOffset

        maxOffsetRef.current =
          maxOffset

        const glowVisible =
          glowRect.bottom >
            homeRect.top &&
          glowRect.top <
            homeRect.bottom

        if (
          glowVisible
        ) {
          const middlePosition =
            Math.min(
              Math.max(
                initialOffset,
                minOffset,
              ),
              maxOffset,
            )

          currentRef.current =
            middlePosition

          setOffset(
            middlePosition,
          )

          setCurrent(
            middlePosition,
          )

          return
        }

        const adjusted =
          Math.min(
            Math.max(
              currentRef.current,
              minOffset,
            ),
            maxOffset,
          )

        currentRef.current =
          adjusted

        setOffset(
          adjusted,
        )

        setCurrent(
          adjusted,
        )
      }

    const frame =
      requestAnimationFrame(
        calculateSheetPosition,
      )

    const observer =
      new ResizeObserver(
        () => {
          calculateSheetPosition()
        },
      )

    if (
      homeRef.current
    ) {
      observer.observe(
        homeRef.current,
      )
    }

    if (
      statsRef.current
    ) {
      observer.observe(
        statsRef.current,
      )
    }

    if (
      glowRef.current
    ) {
      observer.observe(
        glowRef.current,
      )
    }

    if (
      sheetRef.current
    ) {
      observer.observe(
        sheetRef.current,
      )
    }

    window.addEventListener(
      'resize',
      calculateSheetPosition,
    )

    return () => {
      cancelAnimationFrame(
        frame,
      )

      observer.disconnect()

      window.removeEventListener(
        'resize',
        calculateSheetPosition,
      )
    }
  }, [])

  const handlePointerDown = (
    e:
      React.PointerEvent<
        HTMLDivElement
      >,
  ) => {
    startY.current =
      e.clientY

    startOffset.current =
      currentRef.current

    setDragging(
      true,
    )

    e.currentTarget
      .setPointerCapture(
        e.pointerId,
      )
  }

  const handlePointerMove = (
    e:
      React.PointerEvent<
        HTMLDivElement
      >,
  ) => {
    if (
      startY.current ===
      null
    ) {
      return
    }

    const dy =
      e.clientY -
      startY.current

    const next =
      Math.min(
        Math.max(
          startOffset.current +
            dy,
          minOffsetRef.current,
        ),
        maxOffsetRef.current,
      )

    currentRef.current =
      next

    setCurrent(
      next,
    )
  }

  const handlePointerUp = (
    e:
      React.PointerEvent<
        HTMLDivElement
      >,
  ) => {
    if (
      startY.current ===
      null
    ) {
      return
    }

    currentRef.current =
      current

    setOffset(
      current,
    )

    setDragging(
      false,
    )

    startY.current =
      null

    if (
      e.currentTarget
        .hasPointerCapture(
          e.pointerId,
        )
    ) {
      e.currentTarget
        .releasePointerCapture(
          e.pointerId,
        )
    }
  }

  const handlePointerCancel = (
    e:
      React.PointerEvent<
        HTMLDivElement
      >,
  ) => {
    if (
      startY.current ===
      null
    ) {
      return
    }

    setOffset(
      currentRef.current,
    )

    setDragging(
      false,
    )

    startY.current =
      null

    if (
      e.currentTarget
        .hasPointerCapture(
          e.pointerId,
        )
    ) {
      e.currentTarget
        .releasePointerCapture(
          e.pointerId,
        )
    }
  }

  const translateY =
    dragging
      ? current
      : offset

  return (
    <main
      ref={
        homeRef
      }
      className="relative h-[calc(100dvh-64px)] overflow-hidden bg-white"
    >
      {/* 상단 그라데이션 */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[500px]
          bg-gradient-to-b
          from-[#E7F7EC]
          via-[#F0FAF3]
          to-white
        "
      />

      {/* 초록빛 */}
      <div
        ref={
          glowRef
        }
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[310px]
          h-[120px]
          w-[260px]
          -translate-x-1/2
          rounded-[50%]
          bg-[radial-gradient(ellipse_at_center,#8BE8B7_0%,rgba(139,232,183,0.38)_42%,rgba(255,255,255,0)_75%)]
          opacity-40
          blur-[8px]
        "
      />

      {/* 캐릭터 */}
      <img
        src={
          characterUrl
        }
        alt="BLOOM 캐릭터"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[220px]
          z-10
          h-[172px]
          w-auto
          -translate-x-1/2
          object-contain
        "
      />

      {/* BLOOM */}
      <h1
        className="
          absolute
          left-[24px]
          top-[57px]
          flex
          h-[21px]
          w-[57px]
          items-center
          text-[16px]
          font-bold
          leading-[130%]
          text-gray-900
        "
      >
        BLOOM
      </h1>

      {/* 상단 통계 */}
      <div
        ref={
          statsRef
        }
        className="
          absolute
          left-[50px]
          top-[110px]
          flex
          h-[73px]
          w-[314px]
          items-stretch
        "
      >
        {stats.map(
          (
            s,
            idx,
          ) => (
            <div
              key={
                s.label
              }
              className={
                'flex flex-1 flex-col justify-center ' +
                (
                  idx > 0
                    ? 'border-l border-[#D7E8DC] pl-4'
                    : ''
                )
              }
            >
              <span
                className="
                  mb-2
                  whitespace-nowrap
                  text-[11px]
                  text-gray-500
                "
              >
                {
                  s.label
                }
              </span>

              <span
                className="
                  whitespace-nowrap
                  text-[24px]
                  font-extrabold
                  leading-none
                  text-[#32C878]
                "
              >
                {
                  s.value
                }

                {s.unit && (
                  <span
                    className="
                      ml-0.5
                      text-[10px]
                      font-normal
                      text-[#32C878]
                    "
                  >
                    {
                      s.unit
                    }
                  </span>
                )}
              </span>
            </div>
          ),
        )}
      </div>

      {/* AI 분석 리포트 */}
      <section
        ref={
          sheetRef
        }
        style={{
          transform:
            `translateY(${translateY}px)`,

          transition:
            dragging
              ? 'none'
              : 'transform 0.3s ease-out',
        }}
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          h-[85%]
          overflow-hidden
          rounded-t-[22px]
          bg-[#F8F8F8]
          shadow-[0_-6px_20px_rgba(0,0,0,0.04)]
        "
      >
        {/* 드래그 영역 */}
        <div
          onPointerDown={
            handlePointerDown
          }
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
          onPointerCancel={
            handlePointerCancel
          }
          className="
            touch-none
            cursor-grab
            px-6
            pt-3
            active:cursor-grabbing
          "
        >
          <div
            className="
              mx-auto
              h-[3px]
              w-10
              rounded-full
              bg-gray-300
            "
          />

          <button
            type="button"
            onPointerDown={(
              e,
            ) =>
              e.stopPropagation()
            }
            onClick={() =>
              navigate(
                '/home/report',
              )
            }
            className="
              mt-5
              flex
              w-full
              items-center
              justify-between
              text-left
            "
          >
            <h2
              className="
                text-[16px]
                font-bold
                text-gray-900
              "
            >
              AI 분석 리포트
            </h2>

            <IconChevronRight
              className="
                h-5
                w-5
                text-gray-400
              "
            />
          </button>

          <p
            className="
              mt-1
              pr-6
              text-[9px]
              leading-[14px]
              text-gray-400
            "
          >
            AI가 사용자의 신체 정보와 목표를 종합 분석하여
            <br />
            가장 필요한 관리 우선순위와 맞춤 솔루션을 제안해요
          </p>
        </div>

        {/* 리포트 카드 */}
        <div
          className="
            h-[calc(100%-105px)]
            space-y-3
            overflow-y-auto
            px-6
            pb-6
            pt-5
          "
        >
          {aiReportLoading && (
            <div
              className="
                py-10
                text-center
                text-[11px]
                text-gray-400
              "
            >
              AI가 정보를 분석하고 있어요...
            </div>
          )}

          {!aiReportLoading &&
            aiReportError && (
              <div
                className="
                  py-10
                  text-center
                  text-[11px]
                  text-gray-400
                "
              >
                {aiReportError}
              </div>
            )}

          {!aiReportLoading &&
            !aiReportError &&
            homeReport.map(
            (r) => (
              <div
                key={
                  r.label
                }
                className="
                  rounded-xl
                  bg-white
                  px-4
                  py-4
                  shadow-sm
                "
              >
                <div className="flex gap-4">
                  <span
                    className="
                      w-[58px]
                      shrink-0
                      pt-0.5
                      text-[10px]
                      font-semibold
                      text-[#5F9D74]
                    "
                  >
                    {
                      r.label
                    }
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        break-keep
                        text-[12px]
                        font-bold
                        text-[#32B96F]
                      "
                    >
                      {
                        r.heading
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        break-keep
                        text-[10px]
                        leading-[16px]
                        text-gray-500
                      "
                    >
                      {
                        r.body
                      }
                    </p>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  )
}

export default Home