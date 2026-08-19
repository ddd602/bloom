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
  createAiReport,
  getLatestAiReport,
  type AiReportResponse,
} from '../components/api/AiReportApi'

import {
  claimAttendanceReward,
  checkRoutineStreakReward,
  getMileageHistory,
  type MileageHistoryResponse,
} from '../components/api/MileageApi'

import AttendanceRewardModal from '../components/mileage/AttendanceRewardModal'

import {
  getOnboarding,
  type OnboardingData,
} from '../components/api/OnboardingApi'

import {
  pickGoalVariant,
  CHARACTER_BY_GOAL,
} from '../utils/characterVariant'

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

function getSevenDaysAgoDate() {
  const date = new Date()

  date.setDate(
    date.getDate() - 6,
  )

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}


function toSeoulDateString(
  value: Date,
) {
  const parts =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone:
          'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    ).formatToParts(
      value,
    )

  const year =
    parts.find(
      (part) =>
        part.type ===
        'year',
    )?.value

  const month =
    parts.find(
      (part) =>
        part.type ===
        'month',
    )?.value

  const day =
    parts.find(
      (part) =>
        part.type ===
        'day',
    )?.value

  return `${year}-${month}-${day}`
}

function shiftDate(
  date: string,
  days: number,
) {
  const value =
    new Date(
      `${date}T00:00:00Z`,
    )

  value.setUTCDate(
    value.getUTCDate() +
      days,
  )

  return value
    .toISOString()
    .slice(
      0,
      10,
    )
}

function attendanceDateSet(
  history:
    MileageHistoryResponse[],
) {
  return new Set(
    history
      .filter(
        (item) =>
          item.reason ===
          'ATTENDANCE',
      )
      .map(
        (item) =>
          toSeoulDateString(
            new Date(
              item.createdAt,
            ),
          ),
      ),
  )
}

function getNextAttendanceStreak(
  history:
    MileageHistoryResponse[],
) {
  const dates =
    attendanceDateSet(
      history,
    )

  const today =
    toSeoulDateString(
      new Date(),
    )

  let streak = 1

  for (
    let date =
      shiftDate(
        today,
        -1,
      );
    dates.has(date);
    date =
      shiftDate(
        date,
        -1,
      )
  ) {
    streak += 1
  }

  return streak
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
      AiReportResponse | null
    >(null)

  const [
    aiReportLoading,
    setAiReportLoading,
  ] = useState(true)

  const [
    aiReportError,
    setAiReportError,
  ] = useState('')


  const [
    rewardOpen,
    setRewardOpen,
  ] = useState(false)

  const [
    rewardType,
    setRewardType,
  ] =
    useState<
      'ATTENDANCE' | 'ROUTINE'
    >('ATTENDANCE')

  const [
    rewardStage,
    setRewardStage,
  ] =
    useState<
      'READY' | 'DONE'
    >('READY')

  const [
    rewardStreak,
    setRewardStreak,
  ] = useState(1)

  const [
    rewardAmount,
    setRewardAmount,
  ] = useState(0)

  const [
    rewardBalance,
    setRewardBalance,
  ] =
    useState<
      number | null
    >(null)

  const [
    rewardLoading,
    setRewardLoading,
  ] = useState(false)

  const [
    pendingRoutineMilestone,
    setPendingRoutineMilestone,
  ] =
    useState<
      3 | 7 | 14 | null
    >(null)

  const [
    onboarding,
    setOnboarding,
  ] =
    useState<
      OnboardingData | null
    >(null)

  useEffect(() => {
    const loadOnboarding =
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

    void loadOnboarding()
  }, [])

  const characterUrl =
    onboarding
      ? CHARACTER_BY_GOAL[
          pickGoalVariant(
            onboarding.goals,
          )
        ]
      : CHARACTER_BY_GOAL.weight

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
            mileageHistory,
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
              getMileageHistory(),
            ])

          setRoutineStreak(
            streak,
          )

          const attendanceDates =
            attendanceDateSet(
              mileageHistory,
            )

          const seoulToday =
            toSeoulDateString(
              new Date(),
            )

          const attendanceNeeded =
            !attendanceDates.has(
              seoulToday,
            )

          const claimedReasons =
            new Set(
              mileageHistory.map(
                (item) =>
                  item.reason,
              ),
            )

          const routineMilestone:
            | 3
            | 7
            | 14
            | null =
            streak >= 14 &&
            !claimedReasons.has(
              'ROUTINE_STREAK_14',
            )
              ? 14
              : streak >= 7 &&
                  !claimedReasons.has(
                    'ROUTINE_STREAK_7',
                  )
                ? 7
                : streak >= 3 &&
                    !claimedReasons.has(
                      'ROUTINE_STREAK_3',
                    )
                  ? 3
                  : null

          setPendingRoutineMilestone(
            routineMilestone,
          )

          if (
            attendanceNeeded
          ) {
            setRewardType(
              'ATTENDANCE',
            )

            setRewardStreak(
              getNextAttendanceStreak(
                mileageHistory,
              ),
            )

            setRewardAmount(
              100,
            )

            setRewardStage(
              'READY',
            )

            setRewardOpen(
              true,
            )
          } else if (
            routineMilestone !==
            null
          ) {
            setRewardType(
              'ROUTINE',
            )

            setRewardStreak(
              routineMilestone,
            )

            setRewardAmount(
              routineMilestone ===
              14
                ? 500
                : routineMilestone ===
                    7
                  ? 300
                  : 100,
            )

            setRewardStage(
              'READY',
            )

            setRewardOpen(
              true,
            )
          }

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
            await getLatestAiReport()

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
    aiReport &&
    aiReport.status === 'COMPLETED'
      ? [
          {
            label: '관리 목표',
            heading:
              aiReport.priorities[0]?.title ??
              '맞춤 관리 목표',
            body:
              aiReport.priorities[0]?.description ?? '',
          },
          {
            label: '추천 관리',
            heading:
              aiReport.methods[0]?.title ??
              '맞춤 관리 방법',
            body:
              aiReport.methods[0]?.description ?? '',
          },
          {
            label: '추천 관리',
            heading:
              aiReport.methods[1]?.title ??
              '맞춤 관리 방법',
            body:
              aiReport.methods[1]?.description ?? '',
          },
          {
            label: '추천 관리',
            heading:
              aiReport.methods[2]?.title ??
              '맞춤 관리 방법',
            body:
              aiReport.methods[2]?.description ?? '',
          },
        ]
      : []

 const handleOpenAiReport =
  async () => {
    if (aiReportLoading) {
      return
    }

    // 이미 완료된 리포트가 있으면
    // 새로 생성하지 않고 기존 리포트로 이동
    if (
      aiReport &&
      aiReport.status === 'COMPLETED'
    ) {
      navigate('/home/report')
      return
    }

    // 리포트가 없을 때만 최초 생성
    try {
      setAiReportLoading(true)
      setAiReportError('')

      const report =
        await createAiReport({
          from:
            getSevenDaysAgoDate(),
          to:
            getTodayDate(),
        })

      setAiReport(report)

      navigate('/home/report')
    } catch (error) {
      console.error(
        'AI 분석 리포트를 생성하지 못했습니다.',
        error,
      )

      if (
        error instanceof Error &&
        error.message.includes(
          'AI_SERVICE_UNAVAILABLE',
        )
      ) {
        setAiReportError(
          'AI 서비스를 현재 사용할 수 없어요.',
        )
      } else {
        setAiReportError(
          'AI 분석 리포트를 생성하지 못했어요.',
        )
      }
    } finally {
      setAiReportLoading(false)
    }
  }

  const showRoutineReward =
    (
      milestone:
        3 | 7 | 14,
    ) => {
      setRewardType(
        'ROUTINE',
      )

      setRewardStreak(
        milestone,
      )

      setRewardAmount(
        milestone === 14
          ? 500
          : milestone === 7
            ? 300
            : 100,
      )

      setRewardBalance(
        null,
      )

      setRewardStage(
        'READY',
      )

      setRewardOpen(
        true,
      )
    }

  const moveToNextReward =
    () => {
      if (
        rewardType ===
          'ATTENDANCE' &&
        pendingRoutineMilestone !==
          null
      ) {
        const milestone =
          pendingRoutineMilestone

        setPendingRoutineMilestone(
          null,
        )

        showRoutineReward(
          milestone,
        )

        return
      }

      setRewardOpen(
        false,
      )
    }

  const handleClaimReward =
    async () => {
      if (
        rewardLoading
      ) {
        return
      }

      try {
        setRewardLoading(
          true,
        )

        const result =
          rewardType ===
          'ATTENDANCE'
            ? await claimAttendanceReward()
            : await checkRoutineStreakReward()

        if (
          result.rewarded
        ) {
          setRewardAmount(
            result.amount,
          )

          setRewardBalance(
            result.balance,
          )

          setRewardStreak(
            result.streak ??
              rewardStreak,
          )

          setRewardStage(
            'DONE',
          )

          return
        }

        if (
          rewardType ===
            'ATTENDANCE' &&
          result.reason ===
            'ALREADY_REWARDED'
        ) {
          moveToNextReward()
          return
        }

        if (
          rewardType ===
            'ROUTINE' &&
          result.reason ===
            'NO_NEW_REWARD'
        ) {
          setRewardOpen(
            false,
          )
        }
      } catch (error) {
        console.error(
          rewardType ===
            'ATTENDANCE'
            ? '출석 포인트 지급에 실패했습니다.'
            : '루틴 포인트 지급에 실패했습니다.',
          error,
        )
      } finally {
        setRewardLoading(
          false,
        )
      }
    }

  const handleRewardClose =
    () => {
      if (
        rewardStage ===
        'DONE'
      ) {
        moveToNextReward()
        return
      }

      if (
        rewardType ===
          'ATTENDANCE' &&
        pendingRoutineMilestone !==
          null
      ) {
        const milestone =
          pendingRoutineMilestone

        setPendingRoutineMilestone(
          null,
        )

        showRoutineReward(
          milestone,
        )

        return
      }

      setRewardOpen(
        false,
      )
    }

  const handleRewardPrimary =
    () => {
      if (
        rewardStage ===
        'READY'
      ) {
        void handleClaimReward()
        return
      }

      if (
        rewardType ===
          'ATTENDANCE' &&
        pendingRoutineMilestone !==
          null
      ) {
        moveToNextReward()
        return
      }

      setRewardOpen(
        false,
      )

      navigate(
        '/my-page',
      )
    }

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
            onClick={
              handleOpenAiReport
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

      <AttendanceRewardModal
        open={rewardOpen}
        rewardType={rewardType}
        stage={rewardStage}
        streak={rewardStreak}
        amount={rewardAmount}
        balance={rewardBalance}
        loading={rewardLoading}
        hasNextReward={
          rewardType ===
            'ATTENDANCE' &&
          pendingRoutineMilestone !==
            null
        }
        onPrimary={
          handleRewardPrimary
        }
        onClose={
          handleRewardClose
        }
      />
    </main>
  )
}

export default Home