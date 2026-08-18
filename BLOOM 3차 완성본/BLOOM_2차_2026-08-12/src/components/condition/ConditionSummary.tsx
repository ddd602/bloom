import StarRating from './StarRating'

type Props = {
  score: number
  note?: string
}

function ConditionSummary({ score, note }: Props) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-gray-700">
        일일 컨디션 지수
      </p>

      <div className="mt-1 flex items-center gap-2">
        <span className="flex items-baseline gap-1">
          <span className="text-[21px] font-extrabold text-[#31C66B]">
            {score.toFixed(1)}
          </span>

          <span className="text-[11px] text-gray-400">
            / 5.0
          </span>
        </span>

        <StarRating
          score={score}
          size={18}
        />
      </div>

      {note && (
        <p className="mt-2 text-[10px] text-[#65C98C]">
          {note}
        </p>
      )}
    </div>
  )
}

export default ConditionSummary