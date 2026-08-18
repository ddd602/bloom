import { Link, useNavigate } from 'react-router-dom'

import DailyExerciseRecord from '../components/Manage/DailyExerciseRecord'
import NudeBodySection from '../components/Manage/NudeBodySection'
import NudeBodyGallery from '../components/Manage/NudeBodyGallery'

import {
  IconChevronLeft,
  IconChevronRight,
} from '../components/icons'

function Manage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-white">
      <header
        className="shrink-0 px-6"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-gray-900">
            관리하기
          </h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-7">
        {/* 운동하기 */}
        <section>
          <Link
            to="/manage/exercise"
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-[14px] font-bold text-gray-900">
                운동하기
              </h2>

              <p className="mt-1 text-[8px] text-gray-400">
                타이머 기반으로 운동을 수행하고 원하는 운동 루틴을 관리해봐요!
              </p>
            </div>

            <IconChevronRight className="h-6 w-6 text-gray-300" />
          </Link>

          <div className="mt-3">
            <DailyExerciseRecord />
          </div>
        </section>

        {/* AI 눈바디 변화 측정 */}
        <div className="mt-8">
          <NudeBodySection to="/manage/nudebody" />
        </div>

        {/* 눈바디 변화 갤러리 */}
        <div className="mt-8">
          <NudeBodyGallery to="/manage/gallery" />
        </div>

        {/* 스토어 및 시술 내역 */}
        <div className="mt-8">
          <Link
            to="/my-page/store"
            className="flex items-center justify-between"
          >
            <h2 className="text-[14px] font-bold text-gray-900">
              스토어 및 시술 내역
            </h2>

            <IconChevronRight className="h-6 w-6 text-gray-400" />
          </Link>

          <p className="mt-1 text-[8px] leading-[12px] text-gray-400">
            구매한 제품과 예약한 시술 내역을 확인할 수 있어요
          </p>
        </div>
      </div>
    </div>
  )
}

export default Manage