import {
  useEffect,
  useState,
} from 'react'

import ScreenHeader from '../components/ScreenHeader'

import {
  getLatestAiReport,
  type AiReportResponse,
  type AiReportItem,
} from '../components/api/AiReportApi'

// ==============================
// 우선순위 / 관리 방법 공통 섹션
// ==============================

function PrioritySection({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: AiReportItem[]
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

      {items.length === 0 ? (
        <p className="mt-5 text-[12px] text-gray-400">
          아직 분석 결과가 없어요.
        </p>
      ) : (
        <div className="mt-5 space-y-7">
          {items.map(
            (
              item,
              index,
            ) => (
              <div
                key={`${item.title}-${index}`}
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
                    {item.title}
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
                  {
                    item.description
                  }
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  )
}

// ==============================
// 날짜 범위 표시
// ==============================

function formatDate(
  date: string,
) {
  if (!date) {
    return '-'
  }

  const [
    year,
    month,
    day,
  ] =
    date.split('-')

  return `${Number(
    year,
  )}.${String(
    Number(month),
  ).padStart(
    2,
    '0',
  )}.${String(
    Number(day),
  ).padStart(
    2,
    '0',
  )}`
}

export default function AiReport() {
  const [
    report,
    setReport,
  ] =
    useState<AiReportResponse | null>(
      null,
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState('')

  useEffect(() => {
    const loadReport =
      async () => {
        try {
          setLoading(
            true,
          )

          setError('')

          const data =
            await getLatestAiReport()

          setReport(
            data,
          )
        } catch (error) {
          console.error(
            'AI 분석 리포트를 불러오지 못했습니다.',
            error,
          )

          if (
            error instanceof Error &&
            error.message.includes(
              'AI_REPORT_NOT_FOUND',
            )
          ) {
            setError(
              '아직 생성된 AI 분석 리포트가 없어요.',
            )
          } else {
            setError(
              'AI 분석 리포트를 불러오지 못했습니다.',
            )
          }
        } finally {
          setLoading(
            false,
          )
        }
      }

    void loadReport()
  }, [])

  // ==============================
  // 로딩
  // ==============================

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
          AI 분석 리포트를 불러오고 있어요...
        </div>
      </div>
    )
  }

  // ==============================
  // 에러 / 리포트 없음
  // ==============================

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

  // ==============================
  // PROCESSING
  // ==============================

  if (
    report.status ===
    'PROCESSING'
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
          AI가 기록을 분석하고 있어요.
        </div>
      </div>
    )
  }

  // ==============================
  // FAILED
  // ==============================

  if (
    report.status ===
    'FAILED'
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
          AI 분석에 실패했어요.
          잠시 후 다시 시도해주세요.
        </div>
      </div>
    )
  }

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
          min-h-0
          flex-1
          overflow-y-auto
          px-6
          pb-12
          pt-6
        "
      >
        {/* 분석 기간 */}
        <div
          className="
            rounded-[5px]
            border
            border-[#CFE4D6]
            bg-[#EEF7F0]
            px-5
            py-5
          "
        >
          <p className="text-[11px] font-semibold text-gray-500">
            분석 기간
          </p>

          <p className="mt-2 text-[15px] font-bold text-gray-900">
            {formatDate(
              report.from,
            )}
            {' ~ '}
            {formatDate(
              report.to,
            )}
          </p>

          {report.summary && (
            <p
              className="
                mt-4
                break-keep
                text-[12px]
                leading-[19px]
                text-gray-600
              "
            >
              {
                report.summary
              }
            </p>
          )}
        </div>

        {/* AI 관리 우선순위 */}
        <PrioritySection
          title="AI 관리 우선순위 리포트"
          subtitle="최근 기록을 종합 분석하여 우선적으로 관리하면 좋은 항목을 제시해요"
          items={
            report.priorities
          }
        />

        {/* AI 관리 방법 */}
        <PrioritySection
          title="AI 관리 방법 리포트"
          subtitle="분석 결과를 바탕으로 실천할 수 있는 관리 방법을 제안해요"
          items={
            report.methods
          }
        />
      </div>
    </div>
  )
}