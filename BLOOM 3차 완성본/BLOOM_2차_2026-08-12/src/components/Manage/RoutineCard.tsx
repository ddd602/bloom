import type { Routine } from '../types/routines'

type Props = {
  routine: Routine
  onClick?: () => void
  rightTop?: string
}

function RoutineCard({
  routine,
  onClick,
  rightTop,
}: Props) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      onClick={onClick}
      className={
        'flex w-full flex-col gap-1.5 rounded-lg bg-white px-4 py-3 text-left ' +
        (onClick
          ? 'transition-colors active:bg-gray-50'
          : '')
      }
    >
      <div className="flex items-center justify-between text-[9px] text-gray-400">
        <span>
          {routine.tag} · {routine.duration}
        </span>

        {rightTop && (
          <span>
            {rightTop}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <span className="min-w-0 truncate text-[13px] font-bold text-gray-900">
          {routine.name}
        </span>

        <span className="shrink-0 text-[12px] font-bold text-[#31C66B]">
          {routine.kcal}
          <span className="ml-0.5 text-[9px] font-medium">
            kcal
          </span>
        </span>
      </div>
    </Tag>
  )
}

export default RoutineCard