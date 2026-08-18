import {
  useEffect,
  useState,
} from 'react'

import ScreenHeader from '../components/ScreenHeader'

import {
  getAiReport,
  type AiReportData,
} from '../components/api/AiReportApi'

function formatBirthDate(
  date: string,
) {
  if (!date) return '-'

  const [
    year,
    month,
    day,
  ] = date.split('-')

  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`
}

function formatGoal(
  goals: string[],
) {
  const labels: Record<
    string,
    string
  > = {
    weight: '체중 감량',
    line: '라인 관리',
    health: '건강 회복',
    skin: '피부 관리',
  }

  if (
    goals.length === 0
  ) {
    return '-'
  }

  return goals
    .map(
      (goal) =>
        labels[goal] ??
        goal,
    )
    .join(', ')
}

function formatCondition(
  conditions: string[],
) {
  const labels: Record<
    string,
    string
  > = {
    pain:
      '출산 또는 수술 부위 통증',
    tired:
      '피로 · 체력 부족',
    balance:
      '골반 · 허리 균형 불편',
    ok:
      '특별한 문제 없음',
  }

  if (
    conditions.length === 0
  ) {
    return '-'
  }

  return conditions
    .map(
      (condition) =>
        labels[
          condition
        ] ??
        condition,
    )
    .join(', ')
}

// 우선순위 라벨 리포트
function PrioritySection({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: {
    heading: string
    body: string
  }[]
}) {
  return (
    <section className="mt-9">
      <h2
        className="
          text-[17px]
          font-bold
          text-gray-900
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-1.5
          break-keep
          text-[11px]
          leading-[17px]
          text-gray-400
        "
      >
        {subtitle}
      </p>

      <div className="mt-5 space-y-7">
        {items.map(
          (
            item,
            index,
          ) => (
            <div
              key={`${item.heading}-${index}`}
            >
              <div
                className="
                  flex
                  items-start
                  gap-2
                "
              >
                <span
                  className="
                    mt-[1px]
                    shrink-0
                    rounded-md
                    bg-[#FDF3C7]
                    px-2
                    py-0.5
                    text-[10px]
                    font-bold
                    text-[#B78A1A]
                  "
                >
                  Priority{' '}
                  {String(
                    index + 1,
                  ).padStart(
                    2,
                    '0',
                  )}
                </span>

                <span
                  className="
                    break-keep
                    text-[14px]
                    font-bold
                    leading-[20px]
                    text-gray-900
                  "
                >
                  {item.heading}
                </span>
              </div>

              <p
                className="
                  mt-2
                  break-keep
                  text-[12px]
                  leading-[19px]
                  text-gray-600
                "
              >
                {item.body}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

export default function AiReport() {
  const [
    report,
    setReport,
  ] =
    useState<AiReportData | null>(
      null,
    )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  useEffect(() => {
    const loadReport =
      async () => {
        try {
          const data =
            await getAiReport()

          setReport(data)
        } catch (error) {
          console.error(
            'AI 분석 리포트를 불러오지 못했습니다.',
            error,
          )

          setError(
            'AI 분석 리포트를 불러오지 못했습니다.',
          )
        } finally {
          setLoading(
            false,
          )
        }
      }

    loadReport()
  }, [])

  if (loading) {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          bg-white
        "
      >
        <ScreenHeader
          title="AI 분석 리포트"
        />

        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            text-sm
            text-gray-400
          "
        >
          AI가 정보를 분석하고 있어요...
        </div>
      </div>
    )
  }

  if (
    error ||
    !report
  ) {
    return (
      <div
        className="
          flex
          h-full
          flex-col
          bg-white
        "
      >
        <ScreenHeader
          title="AI 분석 리포트"
        />

        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            px-6
            text-center
            text-sm
            text-gray-400
          "
        >
          {error ||
            '분석 리포트가 없습니다.'}
        </div>
      </div>
    )
  }

  const healthInfo = [
    {
      label:
        '생년월일',
      value:
        formatBirthDate(
          report.healthInfo
            .birthDate,
        ),
    },

    {
      label:
        '키 / 몸무게',
      value:
        `${report.healthInfo.height}cm / ${report.healthInfo.weight}kg`,
    },

    {
      label:
        '건강 상태',
      value:
        formatCondition(
          report.healthInfo
            .conditions,
        ),
    },

    {
      label:
        '미용 목표',
      value:
        formatGoal(
          report.healthInfo
            .goals,
        ),
    },
  ]

  return (
    <div
      className="
        flex
        h-full
        flex-col
        bg-white
      "
    >
      {/* 네 ScreenHeader가
          IconChevronLeft를 사용 */}
      <ScreenHeader
        title="AI 분석 리포트"
      />

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-6
          pb-12
          pt-6
        "
      >
        {/* 기본 건강 정보 */}
        <h2
          className="
            text-[17px]
            font-bold
            text-gray-900
          "
        >
          기본 건강 정보
        </h2>

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-[#CFE4D6]
            bg-[#EEF7F0]
            px-5
            py-5
          "
        >
          {/* 이름 / 출산 기간 */}
          <div
            className="
              mb-5
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[14px]
                font-bold
                text-gray-900
              "
            >
              {report.userName ||
                '사용자'}
              님
            </span>

            {report.postpartumText && (
              <span
                className="
                  text-[13px]
                  text-gray-500
                "
              >
                {
                  report.postpartumText
                }
              </span>
            )}
          </div>

          <dl className="space-y-3.5">
            {healthInfo.map(
              (row) => (
                <div
                  key={
                    row.label
                  }
                  className="
                    grid
                    grid-cols-[76px_minmax(0,1fr)]
                    gap-3
                    text-[13px]
                    leading-[19px]
                  "
                >
                  <dt
                    className="
                      shrink-0
                      text-gray-500
                    "
                  >
                    {
                      row.label
                    }
                  </dt>

                  <dd
                    className="
                      min-w-0
                      break-keep
                      text-right
                      font-semibold
                      text-gray-900
                    "
                  >
                    {
                      row.value
                    }
                  </dd>
                </div>
              ),
            )}
          </dl>
        </div>

        {/* AI 관리 우선순위 */}
        <PrioritySection
          title="AI 관리 우선순위 리포트"
          subtitle="AI가 사용자의 신체 정보와 목표를 종합 분석하여 가장 필요한 관리 우선순위를 제시해요"
          items={
            report.priority
          }
        />

        {/* AI 관리 방법 */}
        <PrioritySection
          title="AI 관리 방법 리포트"
          subtitle="AI가 사용자의 신체 정보와 목표를 종합 분석하여 맞춤 솔루션을 제안해요"
          items={
            report.method
          }
        />
      </div>
    </div>
  )
}