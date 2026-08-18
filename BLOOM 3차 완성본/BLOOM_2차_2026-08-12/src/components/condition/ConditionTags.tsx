type Props = {
  options: string[]
  selected: string[]
  onToggle: (tag: string) => void
}

function ConditionTags({
  options,
  selected,
  onToggle,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const on = selected.includes(tag)

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={
              'rounded-full px-2.5 py-1 text-[10px] transition-colors ' +
              (on
                ? 'bg-[#31C66B] font-medium text-white'
                : 'bg-[#EFF8F2] text-[#68B882]')
            }
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}

export default ConditionTags