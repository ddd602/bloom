// 별점 표시 + (onChange가 있으면) 클릭 입력 겸용 컴포넌트
type Props = {
  score: number // 0 ~ max (소수점 표시 지원: 3.5 등)
  max?: number
  size?: number // px
  onChange?: (value: number) => void // 있으면 클릭해서 점수 변경
}

function StarShape({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
    </svg>
  )
}

function StarRating({ score, max = 5, size = 20, onChange }: Props) {
  const interactive = typeof onChange === 'function'

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.max(0, Math.min(1, score - i)) // 이 별의 채움 비율 0~1
        const star = (
          <span
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <StarShape className="absolute inset-0 h-full w-full text-gray-200" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              {/* 안쪽 별은 원래 크기(size) 고정 → 잘려도 모양 유지 */}
              <StarShape
                className="text-gray-900"
                style={{ width: size, height: size, maxWidth: 'none' }}
              />
            </span>
          </span>
        )

        if (!interactive) return <span key={i}>{star}</span>

        return (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}점`}
            onClick={() => onChange!(i + 1)}
            className="leading-none"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
