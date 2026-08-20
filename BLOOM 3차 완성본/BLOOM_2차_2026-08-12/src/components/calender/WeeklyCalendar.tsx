import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  IconCalendar,
  IconChevronLeft,
  IconTriangleDown,
} from '../icons'
import {
  getCompletedExercisesByDate,
} from '../api/ExerciseApi'
import {
  getActivityByDate,
} from '../api/ActivityApi'
import {
  getConditionByDate,
} from '../api/ConditionApi'
import {
  getMealsByDate,
  mealCalories,
} from '../api/MealApi'
import {
  getPeriods,
  type Period,
} from '../api/PeriodApi'
import {
  expandPeriods,
} from './periodUtils'

// Date.getDay() 인덱스(0=일요일) 순서의 요일 라벨
const WEEKDAY_LABELS_BY_DAY = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
]

// 선택 날짜의 전날 구하기
function getPreviousDate(
  date: string,
) {
  const current =
    new Date(date)

  current.setDate(
    current.getDate() - 1,
  )

  const year =
    current.getFullYear()

  const month = String(
    current.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    current.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 선택한 날짜가 속한 주를 기준으로
// weekOffset만큼 이동한 주의 월~일 날짜 키 만들기
function getWeekDateKeys(
  date: string,
  weekOffset: number,
) {
  const selected =
    new Date(date)

  const dayOfWeek =
    selected.getDay()

  const diffToMonday =
    dayOfWeek === 0
      ? -6
      : 1 - dayOfWeek

  const monday =
    new Date(selected)

  monday.setDate(
    selected.getDate() +
      diffToMonday +
      weekOffset * 7,
  )

  return Array.from(
    { length: 7 },
    (_, index) => {
      const current =
        new Date(monday)

      current.setDate(
        monday.getDate() +
          index,
      )

      const year =
        current.getFullYear()

      const month =
        String(
          current.getMonth() + 1,
        ).padStart(2, '0')

      const day =
        String(
          current.getDate(),
        ).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
  )
}



function isDiaryNotFound(
  error: unknown,
) {
  const message =
    error instanceof Error
      ? error.message
      : String(error)

  return (
    message.includes(
      'DIARY_NOT_FOUND',
    ) ||
    message.includes(
      '"status":404',
    )
  )
}

export default function WeeklyCalendar() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [
    periods,
    setPeriods,
  ] = useState<Period[]>([])

  const periodSet =
    useMemo(
      () =>
        expandPeriods(
          periods,
        ),
      [periods],
    )

  const [
    condition,
    setCondition,
  ] = useState(0)

  const [
    conditionDifference,
    setConditionDifference,
  ] = useState<number | null>(null)

  const selectedDateFromMonthly =
    location.state?.selectedDate ??
    '2026-08-11'


  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      selectedDateFromMonthly,
    )

  // 주간 리포트는 같은 주 안에서 날짜만 바뀔 때 다시 불러올 필요가 없으므로
  // 선택 날짜가 속한 주의 월요일을 리포트 기준 키로 사용
  const reportWeekKey =
    useMemo(() => {
      return getWeekDateKeys(
        selectedDate,
        0,
      )[0]
    }, [selectedDate])

  // 선택한 날짜를 현재 히스토리 항목에도 반영
  // (생리 세부기록 등으로 이동했다가 뒤로가기로
  //  돌아왔을 때 선택 날짜가 유지되도록)
  useEffect(() => {
    navigate(
      location.pathname,
      {
        replace: true,
        state: {
          selectedDate,
        },
      },
    )
  }, [selectedDate])

  // 오늘 식사 총칼로리
  const [
    mealTotal,
    setMealTotal,
  ] =
    useState(0)

  // 오늘 - 어제 칼로리 차이
  const [
    mealDifference,
    setMealDifference,
  ] =
    useState<
      number | null
    >(null)

  // 선택 날짜의 총 운동량
  const [
    activityTotal,
    setActivityTotal,
  ] = useState(0)

  // 선택 날짜 - 전날 운동량 차이
  const [
    activityDifference,
    setActivityDifference,
  ] = useState<number | null>(null)

  const [
    weeklyReport,
    setWeeklyReport,
  ] = useState({
    routineRate: 0,
    routineDifference: null as number | null,
    averageMeal: 0,
    averageActivity: 0,
    averageCondition: 0,
  })


  const [
    analysisText,
    setAnalysisText,
  ] = useState(
    '지난주 기록이 충분하지 않아 아직 비교 분석을 만들기 어려워요.',
  )


  useEffect(() => {
    const loadConditionData =
      async () => {
        try {
          const yesterday =
            getPreviousDate(
              selectedDate,
            )

          const [
            todayData,
            yesterdayData,
          ] = await Promise.all([
            getConditionByDate(
              selectedDate,
            ),
            getConditionByDate(
              yesterday,
            ),
          ])

          const todayAverage =
            (todayData.emotionScore +
              todayData.bodyScore) /
            2

          const yesterdayAverage =
            (yesterdayData.emotionScore +
              yesterdayData.bodyScore) /
            2

          setCondition(
            todayAverage,
          )

          const hasYesterdayCondition =
            yesterdayData.emotionScore > 0 ||
            yesterdayData.bodyScore > 0

          if (hasYesterdayCondition) {
            setConditionDifference(
              todayAverage -
              yesterdayAverage,
            )
          } else {
            setConditionDifference(
              null,
            )
          }
        } catch (error) {
          if (
            !isDiaryNotFound(
              error,
            )
          ) {
            console.error(
              '컨디션 데이터를 불러오지 못했습니다.',
              error,
            )
          }

          setCondition(0)

          setConditionDifference(
            null,
          )
        }
      }

    loadConditionData()
  }, [selectedDate])
  // ============================
  // 생리 기록 불러오기
  // ============================

  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const data =
          await getPeriods()

        setPeriods(data)
      } catch (error) {
        console.error(
          '생리 기록을 불러오지 못했습니다.',
          error,
        )
      }
    }

    loadPeriods()
  }, [])
  // ============================
  // 식사 데이터 불러오기
  // 오늘 + 어제
  // ============================

  useEffect(() => {
    const loadMealData =
      async () => {
        try {
          const yesterday =
            getPreviousDate(
              selectedDate,
            )

          const [
            todayResult,
            yesterdayResult,
          ] =
            await Promise.all([
              getMealsByDate(
                selectedDate,
              ),

              getMealsByDate(
                yesterday,
              ),
            ])

          const todayMeals =
            todayResult.meals

          const yesterdayMeals =
            yesterdayResult.meals

          // 오늘 총 섭취량
          const todayTotal =
            mealCalories(
              todayMeals
                .breakfast
                .items,
            ) +
            mealCalories(
              todayMeals
                .lunch
                .items,
            ) +
            mealCalories(
              todayMeals
                .dinner
                .items,
            )

          // 어제 총 섭취량
          const yesterdayTotal =
            mealCalories(
              yesterdayMeals
                .breakfast
                .items,
            ) +
            mealCalories(
              yesterdayMeals
                .lunch
                .items,
            ) +
            mealCalories(
              yesterdayMeals
                .dinner
                .items,
            )

          setMealTotal(
            todayTotal,
          )

          // 어제 실제 식사 기록이 있는지 확인
          const hasYesterdayMeal =
            yesterdayMeals
              .breakfast
              .items.length >
            0 ||
            yesterdayMeals
              .lunch
              .items.length >
            0 ||
            yesterdayMeals
              .dinner
              .items.length >
            0

          if (
            hasYesterdayMeal
          ) {
            setMealDifference(
              todayTotal -
              yesterdayTotal,
            )
          } else {
            setMealDifference(
              null,
            )
          }
        } catch (error) {
          console.error(
            '식사 데이터를 불러오지 못했습니다.',
            error,
          )

          setMealTotal(0)

          setMealDifference(
            null,
          )
        }
      }

    loadMealData()
  }, [selectedDate])

  // ============================
  // 운동 데이터 불러오기
  // 선택 날짜 + 전날
  // ============================

  useEffect(() => {
    const loadExerciseData =
      async () => {
        try {
          const yesterday =
            getPreviousDate(
              selectedDate,
            )

          const [
            todayRecord,
            yesterdayRecord,
          ] =
            await Promise.all([
              getCompletedExercisesByDate(
                selectedDate,
              ),

              getCompletedExercisesByDate(
                yesterday,
              ),
            ])

          const todayTotal =
            todayRecord.routines.reduce(
              (
                sum,
                routine,
              ) =>
                sum +
                (Number(
                  routine.kcal,
                ) || 0),
              0,
            )

          const yesterdayTotal =
            yesterdayRecord.routines.reduce(
              (
                sum,
                routine,
              ) =>
                sum +
                (Number(
                  routine.kcal,
                ) || 0),
              0,
            )

          setActivityTotal(
            todayTotal,
          )

          const hasYesterdayExercise =
            yesterdayRecord.routines
              .length > 0

          if (
            hasYesterdayExercise
          ) {
            setActivityDifference(
              todayTotal -
                yesterdayTotal,
            )
          } else {
            setActivityDifference(
              null,
            )
          }
        } catch (error) {
          console.error(
            '운동 데이터를 불러오지 못했습니다.',
            error,
          )

          setActivityTotal(0)

          setActivityDifference(
            null,
          )
        }
      }

    loadExerciseData()
  }, [selectedDate])

  // ============================
  // 지난주 기록 리포트
  // 선택 날짜가 속한 주의 바로 전 주 기준
  // ============================

  useEffect(() => {
    const loadWeeklyReport =
      async () => {
        try {
          const lastWeekDates =
            getWeekDateKeys(
              reportWeekKey,
              -1,
            )

          const twoWeeksAgoDates =
            getWeekDateKeys(
              reportWeekKey,
              -2,
            )

          const [
            lastWeekMeals,
            lastWeekExercises,
            lastWeekActivities,
            lastWeekConditions,
            twoWeeksAgoMeals,
            twoWeeksAgoExercises,
            twoWeeksAgoActivities,
            twoWeeksAgoConditions,
          ] =
            await Promise.all([
              Promise.all(
                lastWeekDates.map(
                  (date) =>
                    getMealsByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                lastWeekDates.map(
                  (date) =>
                    getCompletedExercisesByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                lastWeekDates.map(
                  (date) =>
                    getActivityByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                lastWeekDates.map(
                  (date) =>
                    getConditionByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                twoWeeksAgoDates.map(
                  (date) =>
                    getMealsByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                twoWeeksAgoDates.map(
                  (date) =>
                    getCompletedExercisesByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                twoWeeksAgoDates.map(
                  (date) =>
                    getActivityByDate(
                      date,
                    ),
                ),
              ),

              Promise.all(
                twoWeeksAgoDates.map(
                  (date) =>
                    getConditionByDate(
                      date,
                    ),
                ),
              ),
            ])

          // 지난주 운동한 날짜 비율
          const lastWeekExerciseDays =
            lastWeekExercises.filter(
              (record) =>
                record.routines.length >
                0,
            ).length

          const twoWeeksAgoExerciseDays =
            twoWeeksAgoExercises.filter(
              (record) =>
                record.routines.length >
                0,
            ).length

          const routineRate =
            Math.round(
              (lastWeekExerciseDays /
                7) *
                100,
            )

          const twoWeeksAgoRate =
            Math.round(
              (twoWeeksAgoExerciseDays /
                7) *
                100,
            )

          // 평균 섭취량:
          // 실제 식사 기록이 있는 날짜만 평균
          const mealTotals =
            lastWeekMeals
              .map((result) => {
                const meals =
                  result.meals

                const hasMeal =
                  meals.breakfast
                    .items.length >
                    0 ||
                  meals.lunch.items
                    .length >
                    0 ||
                  meals.dinner.items
                    .length >
                    0

                if (!hasMeal) {
                  return null
                }

                return (
                  mealCalories(
                    meals.breakfast
                      .items,
                  ) +
                  mealCalories(
                    meals.lunch.items,
                  ) +
                  mealCalories(
                    meals.dinner.items,
                  )
                )
              })
              .filter(
                (
                  total,
                ): total is number =>
                  total !== null,
              )

          const averageMeal =
            mealTotals.length > 0
              ? Math.round(
                  mealTotals.reduce(
                    (sum, total) =>
                      sum + total,
                    0,
                  ) /
                    mealTotals.length,
                )
              : 0

          // 평균 활동량:
          // 걸음 kcal + 완료 운동 kcal
          // 실제 기록이 있는 날짜만 평균
          const activityTotals =
            lastWeekDates
              .map((_, index) => {
                const activity =
                  lastWeekActivities[
                    index
                  ]

                const exercise =
                  lastWeekExercises[
                    index
                  ]

                const exerciseKcal =
                  exercise.routines.reduce(
                    (
                      sum,
                      routine,
                    ) =>
                      sum +
                      (Number(
                        routine.kcal,
                      ) || 0),
                    0,
                  )

                const hasActivity =
                  activity.steps > 0 ||
                  activity.kcal > 0 ||
                  exercise.routines
                    .length > 0

                if (!hasActivity) {
                  return null
                }

                return (
                  activity.kcal +
                  exerciseKcal
                )
              })
              .filter(
                (
                  total,
                ): total is number =>
                  total !== null,
              )

          const averageActivity =
            activityTotals.length >
            0
              ? Math.round(
                  activityTotals.reduce(
                    (sum, total) =>
                      sum + total,
                    0,
                  ) /
                    activityTotals.length,
                )
              : 0

          // 평균 컨디션:
          // 실제 컨디션 기록이 있는 날짜만 평균
          const conditionScores =
            lastWeekConditions
              .map((data) => {
                const hasCondition =
                  data.emotionScore >
                    0 ||
                  data.bodyScore > 0

                if (
                  !hasCondition
                ) {
                  return null
                }

                return (
                  (data.emotionScore +
                    data.bodyScore) /
                  2
                )
              })
              .filter(
                (
                  score,
                ): score is number =>
                  score !== null,
              )

          const averageCondition =
            conditionScores.length >
            0
              ? Number(
                  (
                    conditionScores.reduce(
                      (
                        sum,
                        score,
                      ) =>
                        sum +
                        score,
                      0,
                    ) /
                    conditionScores.length
                  ).toFixed(1),
                )
              : 0

          // 2주 전 평균 섭취량
          const twoWeeksAgoMealTotals =
            twoWeeksAgoMeals
              .map((result) => {
                const meals =
                  result.meals

                const hasMeal =
                  meals.breakfast
                    .items.length > 0 ||
                  meals.lunch.items
                    .length > 0 ||
                  meals.dinner.items
                    .length > 0

                if (!hasMeal) {
                  return null
                }

                return (
                  mealCalories(
                    meals.breakfast.items,
                  ) +
                  mealCalories(
                    meals.lunch.items,
                  ) +
                  mealCalories(
                    meals.dinner.items,
                  )
                )
              })
              .filter(
                (
                  total,
                ): total is number =>
                  total !== null,
              )

          const twoWeeksAgoAverageMeal =
            twoWeeksAgoMealTotals.length > 0
              ? Math.round(
                  twoWeeksAgoMealTotals.reduce(
                    (sum, total) =>
                      sum + total,
                    0,
                  ) /
                    twoWeeksAgoMealTotals.length,
                )
              : 0

          // 2주 전 평균 활동량
          const twoWeeksAgoActivityTotals =
            twoWeeksAgoDates
              .map((_, index) => {
                const activity =
                  twoWeeksAgoActivities[
                    index
                  ]

                const exercise =
                  twoWeeksAgoExercises[
                    index
                  ]

                const exerciseKcal =
                  exercise.routines.reduce(
                    (
                      sum,
                      routine,
                    ) =>
                      sum +
                      (Number(
                        routine.kcal,
                      ) || 0),
                    0,
                  )

                const hasActivity =
                  activity.steps > 0 ||
                  activity.kcal > 0 ||
                  exercise.routines.length > 0

                if (!hasActivity) {
                  return null
                }

                return (
                  activity.kcal +
                  exerciseKcal
                )
              })
              .filter(
                (
                  total,
                ): total is number =>
                  total !== null,
              )

          const twoWeeksAgoAverageActivity =
            twoWeeksAgoActivityTotals.length > 0
              ? Math.round(
                  twoWeeksAgoActivityTotals.reduce(
                    (sum, total) =>
                      sum + total,
                    0,
                  ) /
                    twoWeeksAgoActivityTotals.length,
                )
              : 0

          // 2주 전 평균 컨디션
          const twoWeeksAgoConditionScores =
            twoWeeksAgoConditions
              .map((data) => {
                const hasCondition =
                  data.emotionScore > 0 ||
                  data.bodyScore > 0

                if (!hasCondition) {
                  return null
                }

                return (
                  (data.emotionScore +
                    data.bodyScore) /
                  2
                )
              })
              .filter(
                (
                  score,
                ): score is number =>
                  score !== null,
              )

          const twoWeeksAgoAverageCondition =
            twoWeeksAgoConditionScores.length > 0
              ? Number(
                  (
                    twoWeeksAgoConditionScores.reduce(
                      (sum, score) =>
                        sum + score,
                      0,
                    ) /
                    twoWeeksAgoConditionScores.length
                  ).toFixed(1),
                )
              : 0

          // 저장된 기록이 양쪽 주에 모두 있을 때만 비교 문장 생성
          const analysisParts: string[] = []

          if (
            mealTotals.length > 0 &&
            twoWeeksAgoMealTotals.length > 0
          ) {
            const difference =
              averageMeal -
              twoWeeksAgoAverageMeal

            if (difference > 0) {
              analysisParts.push(
                `평균 식사량은 2주 전보다 ${difference.toLocaleString()} kcal 늘었어요.`,
              )
            } else if (difference < 0) {
              analysisParts.push(
                `평균 식사량은 2주 전보다 ${Math.abs(difference).toLocaleString()} kcal 줄었어요.`,
              )
            } else {
              analysisParts.push(
                '평균 식사량은 2주 전과 같아요.',
              )
            }
          }

          if (
            activityTotals.length > 0 &&
            twoWeeksAgoActivityTotals.length > 0
          ) {
            const difference =
              averageActivity -
              twoWeeksAgoAverageActivity

            if (difference > 0) {
              analysisParts.push(
                `평균 활동량은 ${difference.toLocaleString()} kcal 늘었어요.`,
              )
            } else if (difference < 0) {
              analysisParts.push(
                `평균 활동량은 ${Math.abs(difference).toLocaleString()} kcal 줄었어요.`,
              )
            } else {
              analysisParts.push(
                '평균 활동량은 2주 전과 같아요.',
              )
            }
          }

          if (
            conditionScores.length > 0 &&
            twoWeeksAgoConditionScores.length > 0
          ) {
            const difference = Number(
              (
                averageCondition -
                twoWeeksAgoAverageCondition
              ).toFixed(1),
            )

            if (difference > 0) {
              analysisParts.push(
                `평균 컨디션은 ${difference.toFixed(1)}점 좋아졌어요.`,
              )
            } else if (difference < 0) {
              analysisParts.push(
                `평균 컨디션은 ${Math.abs(difference).toFixed(1)}점 낮아졌어요.`,
              )
            } else {
              analysisParts.push(
                '평균 컨디션은 2주 전과 같아요.',
              )
            }
          }

          if (analysisParts.length > 0) {
            setAnalysisText(
              analysisParts.join(' '),
            )
          } else {
            setAnalysisText(
              '지난주와 2주 전 기록이 충분하지 않아 아직 비교 분석을 만들기 어려워요.',
            )
          }

          setWeeklyReport({
            routineRate,

            routineDifference:
              routineRate -
              twoWeeksAgoRate,

            averageMeal,

            averageActivity,

            averageCondition,
          })
        } catch (error) {
          if (
            !isDiaryNotFound(
              error,
            )
          ) {
            console.error(
              '지난주 기록 리포트를 불러오지 못했습니다.',
              error,
            )
          }

          setWeeklyReport({
            routineRate: 0,
            routineDifference:
              null,
            averageMeal: 0,
            averageActivity: 0,
            averageCondition: 0,
          })

          setAnalysisText(
            isDiaryNotFound(
              error,
            )
              ? '지난주와 2주 전 기록이 충분하지 않아 아직 비교 분석을 만들기 어려워요.'
              : '지난주 기록을 분석하지 못했어요.',
          )
        }
      }

    loadWeeklyReport()
  }, [reportWeekKey])

  const summary = {
    mealTotal,
    activityTotal,
    condition,
  }

  // ============================
  // 주간 날짜 계산
  // ============================

  const weekDates =
    useMemo(() => {
      const selected =
        new Date(
          selectedDate,
        )

      // 선택한 날짜가 항상 가운데(index 3)에 오도록
      // 앞뒤 3일씩 포함한 7일 구간을 만듦
      return Array.from(
        { length: 7 },
        (_, index) => {
          const date =
            new Date(
              selected,
            )

          date.setDate(
            selected.getDate() +
            (index - 3),
          )

          return date
        },
      )
    }, [selectedDate])

  const referenceDate =
    weekDates[3]

  const selectedYear =
    referenceDate.getFullYear()

  const selectedMonth =
    referenceDate.getMonth() +
    1

  const firstDayOfMonth =
    new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      1,
    )

  const firstDayOffset =
    (firstDayOfMonth.getDay() +
      6) %
    7

  const weekNumber =
    Math.ceil(
      (referenceDate.getDate() +
        firstDayOffset) /
      7,
    )

  const PEEK = 90

  const [
    offset,
    setOffset,
  ] =
    useState(0)

  const [
    current,
    setCurrent,
  ] =
    useState(0)

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

  const sheetRef =
    useRef<HTMLElement>(
      null,
    )

  // ============================
  // 바텀 시트
  // ============================

  const maxDown = () => {
    const h =
      sheetRef.current
        ?.offsetHeight ??
      400

    return Math.max(
      0,
      h - PEEK,
    )
  }

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    startY.current =
      e.clientY

    startOffset.current =
      offset

    setDragging(true)
  }

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (
      startY.current ===
      null
    )
      return

    const dy =
      e.clientY -
      startY.current

    const next =
      Math.min(
        Math.max(
          startOffset.current +
          dy,
          0,
        ),

        maxDown(),
      )

    currentRef.current =
      next

    setCurrent(next)
  }

  const handlePointerUp =
    () => {
      if (
        startY.current ===
        null
      )
        return

      setOffset(
        currentRef.current,
      )

      setDragging(false)

      startY.current =
        null
    }

  const translateY =
    dragging
      ? current
      : offset

  const [
    weekPickerOpen,
    setWeekPickerOpen,
  ] =
    useState(false)

  const handleWeekSelect = (
    week: number,
  ) => {
    const firstDay =
      new Date(
        selectedYear,
        selectedMonth - 1,
        1,
      )

    const firstDayOffset =
      (firstDay.getDay() +
        6) %
      7

    const mondayDate =
      1 -
      firstDayOffset +
      (week - 1) * 7

    const monday =
      new Date(
        selectedYear,
        selectedMonth - 1,
        mondayDate,
      )

    const dateKey =
      `${monday.getFullYear()}-${String(
        monday.getMonth() +
        1,
      ).padStart(
        2,
        '0',
      )}-${String(
        monday.getDate(),
      ).padStart(
        2,
        '0',
      )}`

    setSelectedDate(
      dateKey,
    )

    setWeekPickerOpen(
      false,
    )
  }


  return (
    <main className="relative flex h-[calc(100dvh-64px)] flex-col overflow-hidden bg-white">

      {/* 헤더 */}
      <header
        className="relative shrink-0 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="flex h-6 w-6 items-center justify-center text-gray-500"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setWeekPickerOpen(
                    (open) =>
                      !open,
                  )
                }
                className="flex h-[21px] items-center gap-1 text-sm font-bold text-gray-900"
              >
                {selectedYear}년{' '}
                {selectedMonth}월{' '}
                {weekNumber}주차

                <span className="flex h-6 w-6 items-center justify-center text-gray-500 leading-none">
                  <IconTriangleDown className="h-6 w-6 text-gray-500" />
                </span>
              </button>

              {weekPickerOpen && (
                <div className="absolute left-0 top-7 z-30 w-40 rounded-[5px] bg-white p-2 shadow-lg">
                  {Array.from(
                    {
                      length: 5,
                    },
                    (
                      _,
                      index,
                    ) => {
                      const week =
                        index +
                        1

                      return (
                        <button
                          key={
                            week
                          }
                          type="button"
                          onClick={() =>
                            handleWeekSelect(
                              week,
                            )
                          }
                          className="block w-full rounded-[5px] px-3 py-2 text-left text-xs text-gray-700 hover:bg-[#EAF8EC]"
                        >
                          {selectedMonth}
                          월{' '}
                          {week}
                          주차
                        </button>
                      )
                    },
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/calendar',
              )
            }
            aria-label="월간 캘린더로 이동"
            className="flex h-6 w-6 items-center justify-center"
          >
            <IconCalendar className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* 주간 날짜 */}
        <div className="mt-9 grid grid-cols-7 text-center">
          {weekDates.map(
            (date, dateIndex) => {
              const weekday =
                WEEKDAY_LABELS_BY_DAY[
                date.getDay()
                ]

              const toDateKey = (
                d: Date,
              ) =>
                `${d.getFullYear()}-${String(
                  d.getMonth() +
                  1,
                ).padStart(
                  2,
                  '0',
                )}-${String(
                  d.getDate(),
                ).padStart(
                  2,
                  '0',
                )}`

              const dateKey =
                toDateKey(date)

              const isSelected =
                selectedDate ===
                dateKey

              const isPeriod =
                periodSet.has(
                  dateKey,
                )

              const prevIsPeriod =
                dateIndex > 0 &&
                periodSet.has(
                  toDateKey(
                    weekDates[
                    dateIndex - 1
                    ],
                  ),
                )

              const nextIsPeriod =
                dateIndex < 6 &&
                periodSet.has(
                  toDateKey(
                    weekDates[
                    dateIndex + 1
                    ],
                  ),
                )

              const periodBandClass =
                (prevIsPeriod
                  ? ''
                  : 'rounded-l-full') +
                ' ' +
                (nextIsPeriod
                  ? ''
                  : 'rounded-r-full')

              return (
                <div
                  key={
                    dateKey
                  }
                  className="relative flex flex-col items-center"
                >
                  <div className="relative flex h-[24px] items-end justify-center">
                    {isSelected && (
                      <span className="absolute top-0 h-[4px] w-[4px] rounded-full bg-[#32DE8B]" />
                    )}

                    <p
                      className={`text-[12px] font-medium ${isSelected
                        ? 'font-semibold text-[#32DE8B]'
                        : 'text-gray-500'
                        }`}
                    >
                      {
                        weekday
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDate(
                        dateKey,
                      )
                    }
                    className="relative mt-2 flex h-[28px] w-full items-center justify-center text-[15px]"
                  >
                    {isPeriod && (
                      <span
                        className={
                          'absolute inset-y-0 left-0 right-0 bg-[#FFFDE7] ' +
                          periodBandClass
                        }
                      />
                    )}

                    <span
                      className={`relative z-10 ${isSelected
                        ? 'font-semibold text-[#32DE8B]'
                        : 'font-normal text-gray-500'
                        }`}
                    >
                      {
                        date.getDate()
                      }
                    </span>
                  </button>
                </div>
              )
            },
          )}
        </div>
      </header>

      {/* 메모 */}

      {/* 바텀 시트 */}
      <section
        ref={sheetRef}
        style={{
          transform: `translateY(${translateY}px)`,

          transition:
            dragging
              ? 'none'
              : 'transform 0.3s ease-out',
        }}
        className="
          relative
          mt-4
          min-h-0
          flex-1
          overflow-hidden
          rounded-t-[5px]
          bg-white
          px-5
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
          className="touch-none cursor-grab py-3 active:cursor-grabbing"
        >
          <div className="mx-auto h-[3px] w-10 rounded-full bg-gray-300" />
        </div>

        <div className="max-h-[calc(100%-40px)] overflow-y-auto">

          {/* 오늘의 기록 */}
          <div className="mb-4">
            <h2 className="text-[18px] font-bold text-gray-900">
              오늘의 기록
            </h2>

            <p className="mt-1.5 pl-1 text-[10px] text-gray-400">
              오늘의 식사량,
              활동량, 컨디션을
              한눈에 확인해요
            </p>
          </div>

          {/* 오늘의 식사량 */}
          <div
            onClick={() =>
              navigate('/DailyMealDetail', {
                state: {
                  selectedDate,
                },
              })
            }
            className={`mb-2 cursor-pointer rounded-[5px] px-4 py-3 ${summary.mealTotal >
              0
              ? 'border border-[#32DE8B] bg-[#EAF8EC]'
              : 'bg-[#F5F5F5]'
              }`}
          >
            <p className="text-[10px] text-gray-500">
              오늘의 식사량
            </p>

            <div className="mt-1.5 flex items-end justify-between gap-3">
              <p className="shrink-0 font-bold leading-none text-gray-900">
                <span className="text-[24px]">
                  {summary.mealTotal.toLocaleString()}
                </span>

                <span className="ml-1 text-[13px]">
                  kcal
                </span>
              </p>

              <p className="pb-0.5 text-right text-[9px] text-gray-700">
                {summary.mealTotal >
                  0 ? (
                  mealDifference ===
                    null ? (
                    <span className="text-gray-400">
                      어제 기록이
                      없어요
                    </span>
                  ) : mealDifference <
                    0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {Math.abs(
                          mealDifference,
                        ).toLocaleString()}{' '}
                        kcal
                      </span>{' '}
                      덜
                      섭취했어요!
                    </>
                  ) : mealDifference >
                    0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {mealDifference.toLocaleString()}{' '}
                        kcal
                      </span>{' '}
                      더
                      섭취했어요!
                    </>
                  ) : (
                    <span>
                      어제와 같은
                      양을
                      섭취했어요!
                    </span>
                  )
                ) : (
                  <span className="text-gray-400">
                    아직 기록
                    전이에요
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 오늘의 총 활동량 */}
          <div
            onClick={() =>
              navigate(
                '/activity',{
                  state: {
                    selectedDate,
                  },
                }
              )
            }
            className={`mb-2 cursor-pointer rounded-[5px] px-4 py-3 ${summary.activityTotal >
              0
              ? 'border border-[#32DE8B] bg-[#EAF8EC]'
              : 'bg-[#F5F5F5]'
              }`}
          >
            <p className="text-[10px] text-gray-500">
              오늘의 총 활동량
            </p>

            <div className="mt-1.5 flex items-end justify-between gap-3">
              <p className="shrink-0 font-bold leading-none text-gray-900">
                <span className="text-[24px]">
                  {summary.activityTotal.toLocaleString()}
                </span>

                <span className="ml-1 text-[13px]">
                  kcal
                </span>
              </p>

              <p className="pb-0.5 text-right text-[9px] text-gray-700">
                {summary.activityTotal >
                  0 ? (
                  activityDifference ===
                    null ? (
                    <span className="text-gray-400">
                      어제 기록이
                      없어요
                    </span>
                  ) : activityDifference >
                    0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {activityDifference.toLocaleString()}{' '}
                        kcal
                      </span>{' '}
                      더
                      움직였어요!
                    </>
                  ) : activityDifference <
                    0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {Math.abs(
                          activityDifference,
                        ).toLocaleString()}{' '}
                        kcal
                      </span>{' '}
                      덜
                      움직였어요
                    </>
                  ) : (
                    <span>
                      어제와 활동량이
                      같아요
                    </span>
                  )
                ) : (
                  <span className="text-gray-400">
                    아직 기록
                    전이에요
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 오늘의 컨디션 */}
          <div
            onClick={() =>
              navigate(
                '/conditionDetail',
                {
                  state: {
                    selectedDate,
                  },
                },
              )
            }
            className={`mb-4 cursor-pointer rounded-[5px] px-4 py-3 ${summary.condition >
              0
              ? 'border border-[#32DE8B] bg-[#EAF8EC]'
              : 'bg-[#F5F5F5]'
              }`}
          >
            <p className="text-[10px] text-gray-500">
              오늘의 컨디션
            </p>

            <div className="mt-1.5 flex items-end justify-between gap-3">
              <p className="shrink-0 font-bold leading-none text-gray-900">
                <span className="text-[24px]">
                  {summary.condition.toFixed(
                    1,
                  )}
                </span>

                <span className="ml-1 text-[13px]">
                  /5.0
                </span>
              </p>

              <p className="pb-0.5 text-right text-[9px] text-gray-700">
                {summary.condition > 0 ? (
                  conditionDifference === null ? (
                    <span className="text-gray-400">
                      어제 기록이 없어요
                    </span>
                  ) : conditionDifference > 0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {conditionDifference.toFixed(1)}점 좋아요!
                      </span>
                    </>
                  ) : conditionDifference < 0 ? (
                    <>
                      어제보다{' '}
                      <span className="font-semibold text-[#20B970]">
                        {Math.abs(
                          conditionDifference,
                        ).toFixed(1)}
                        점 낮아요
                      </span>
                    </>
                  ) : (
                    <span>
                      어제와 컨디션이 같아요
                    </span>
                  )
                ) : (
                  <span className="text-gray-400">
                    아직 기록 전이에요
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 이번 주 분석 */}
          <div className="mb-8 mt-5 rounded-[5px] border border-[#FFE45E] bg-[#FFFDE7] p-4">
            <p className="text-xs font-bold text-gray-900">
              이번 주 분석
            </p>

            <p className="mt-2 text-[10px] leading-5 text-gray-500">
              {analysisText}
            </p>
          </div>

          {/* 지난주 기록 리포트 */}
          <div className="mt-7">
            <h2 className="text-[16px] font-bold text-gray-900">
              지난주 기록 리포트
            </h2>

            <p className="mt-1 text-[8px] leading-4 text-gray-400">
              식단, 활동량,
              컨디션을 한눈에
              확인하고 지난 한
              주의 변화와 성장을
              돌아봐요
            </p>

            <div className="mt-5 rounded-[5px] bg-white px-5 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500">
                    지난주 루틴
                    이행률
                  </p>

                  <p className="mt-2 text-[32px] font-bold leading-none text-gray-900">
                    {weeklyReport.routineRate}%
                  </p>
                </div>

                <p className="mt-1 text-[9px] text-gray-700">
                  2주전에 비해{' '}

                  {weeklyReport.routineDifference ===
                  null ? (
                    <span className="text-gray-400">
                      비교 기록이 없어요
                    </span>
                  ) : weeklyReport.routineDifference >
                    0 ? (
                    <>
                      <span className="font-semibold text-[#32DE8B]">
                        {weeklyReport.routineDifference}%
                        증가
                      </span>{' '}
                      했어요
                    </>
                  ) : weeklyReport.routineDifference <
                    0 ? (
                    <>
                      <span className="font-semibold text-gray-500">
                        {Math.abs(
                          weeklyReport.routineDifference,
                        )}
                        % 감소
                      </span>{' '}
                      했어요
                    </>
                  ) : (
                    <span className="text-gray-500">
                      동일해요
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-4 h-[7px] w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#32DE8B]"
                  style={{
                    width: `${weeklyReport.routineRate}%`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[5px] border border-[#FFE45E] bg-[#FFFDE7] px-2 py-3 text-center">
                  <p className="text-[10px] text-gray-500">
                    평균 섭취량
                  </p>

                  <p className="mt-2 text-[16px] font-semibold text-[#32C878]">
                    {weeklyReport.averageMeal.toLocaleString()}
                    <span className="ml-1 text-[12px] font-normal">
                      kcal
                    </span>
                  </p>
                </div>

                <div className="rounded-[5px] border border-[#FFE45E] bg-[#FFFDE7] px-2 py-3 text-center">
                  <p className="text-[10px] text-gray-500">
                    평균 활동량
                  </p>

                  <p className="mt-2 text-[16px] font-semibold text-[#32C878]">
                    {weeklyReport.averageActivity.toLocaleString()}
                    <span className="ml-1 text-[12px] font-normal">
                      kcal
                    </span>
                  </p>
                </div>

                <div className="rounded-[5px] border border-[#FFE45E] bg-[#FFFDE7] px-2 py-3 text-center">
                  <p className="text-[10px] text-gray-500">
                    평균 컨디션
                  </p>

                  <p className="mt-2 text-[16px] font-semibold text-[#32C878]">
                    {weeklyReport.averageCondition.toFixed(1)}
                    <span className="ml-1 text-[12px] font-normal">
                      / 5.0
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}