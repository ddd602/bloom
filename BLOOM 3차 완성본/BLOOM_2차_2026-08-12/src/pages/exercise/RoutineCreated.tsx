import { Navigate, useNavigate } from 'react-router-dom'

import RoutineCard from '../../components/Manage/RoutineCard'
import ScreenHeader from '../../components/ScreenHeader'
import { useExercise } from '../../components/context/ExerciseContext'

function RoutineCreated() {
  const navigate = useNavigate()
  const { lastCreated } = useExercise()

  if (!lastCreated) {
    return <Navigate to="/manage/exercise" replace />
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader
        title="새 운동루틴 만들기"
        onBack={() => navigate('/manage/exercise')}
      />

      <div className="flex flex-1 flex-col px-6 pb-8">
        <div className="pt-[90px] text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F8EE] text-[26px] text-[#31C66B]">
            ✓
          </div>

          <p className="text-[24px] font-extrabold leading-[1.4] text-gray-900">
            새로운 루틴이
            <br />
            등록 되었습니다!
          </p>
        </div>

        <div className="mt-10 rounded-lg bg-[#F8F8F8] p-3">
          <RoutineCard routine={lastCreated} />
        </div>

        <button
          type="button"
          onClick={() => navigate('/manage/exercise')}
          className="mt-auto w-full rounded-full bg-[#31C66B] py-3.5 text-[15px] font-bold text-white transition-colors active:bg-[#29B760]"
        >
          돌아가기
        </button>
      </div>
    </div>
  )
}

export default RoutineCreated