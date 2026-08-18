import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { IconChevronLeft } from './icons'

type Props = {
  title: string
  onBack?: () => void
  right?: ReactNode
}

function ScreenHeader({ title, onBack, right }: Props) {
  const navigate = useNavigate()

  return (
    <header
      className="shrink-0 px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
      }}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          aria-label="뒤로가기"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-500"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="ml-3 text-sm font-bold text-gray-900">
          {title}
        </h1>

        {right && (
          <div className="ml-auto">
            {right}
          </div>
        )}
      </div>
    </header>
  )
}

export default ScreenHeader