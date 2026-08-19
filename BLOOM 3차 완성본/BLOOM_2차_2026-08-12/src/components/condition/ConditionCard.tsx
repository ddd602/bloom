import StarRating from './StarRating'

type Props = {
  title: string
  score: number
  tags: string[]
}

function ConditionCard({ title, score, tags }: Props) {
  const shown = tags.slice(0, 2)
  const extra = tags.length - shown.length

  return (
    <div className="min-h-[100px] rounded-[5px] bg-[#FAFAFA] p-3">
      <p className="text-[11px] font-semibold text-gray-700">
        {title}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-[18px] font-extrabold text-gray-800">
          {score.toFixed(1)}
        </span>

        <span className="text-[10px] text-gray-400">
          / 5.0
        </span>
      </div>

      <div className="mt-1">
        <StarRating score={score} size={16} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {shown.map((tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-[#31C66B]
              px-2 py-0.5
              text-[9px] font-medium text-white
            "
          >
            {tag}
          </span>
        ))}

        {extra > 0 && (
          <span
            className="
              rounded-full
              bg-[#31C66B]
              px-2 py-0.5
              text-[9px] font-medium text-white
            "
          >
            +{extra}
          </span>
        )}
      </div>
    </div>
  )
}

export default ConditionCard