import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader'

// 선택 가능한 캐릭터 디자인 (데모)
const DESIGNS = 6

export default function CharacterSetting() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="내 캐릭터 설정하기" />

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-10">
        {/* 캐릭터 미리보기 — 남은 공간 세로 중앙 */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex h-52 w-52 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500">
            캐릭터
          </div>
          {/* 페이지 표시 점 */}
          <div className="mt-4 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-800" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* 캐릭터 디자인 선택 — 하단 */}
        <div className="rounded-[5px] bg-gray-200 p-4">
          <p className="mb-3 text-sm font-bold text-gray-900">캐릭터 디자인</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {Array.from({ length: DESIGNS }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                aria-label={`디자인 ${i + 1}`}
                className={
                  'h-16 w-16 shrink-0 rounded-full bg-gray-400 transition ' +
                  (selected === i
                    ? 'ring-2 ring-gray-800 ring-offset-2 ring-offset-gray-200'
                    : '')
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
