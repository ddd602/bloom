import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import RoutineCard from '../../components/Manage/RoutineCard'
import ScreenHeader from '../../components/ScreenHeader'
import { useExercise } from '../../components/context/ExerciseContext'
import { getProfile } from '../../components/api/OnboardingApi'

function ExerciseComplete() {
  const navigate = useNavigate()
  const { sessionCompleted } = useExercise()

  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getProfile()
        setUserName(user.nickname ?? '')
      } catch (error) {
        console.error(
          '사용자 정보를 불러오지 못했습니다.',
          error,
        )
      }
    }

    void loadUser()
  }, [])

  if (sessionCompleted.length === 0) {
    return <Navigate to="/manage/exercise" replace />
  }

  const total = sessionCompleted.reduce(
    (sum, r) => sum + r.kcal,
    0,
  )

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader
        title="운동하기"
        onBack={() => navigate('/manage/exercise')}
      />

      <div className="flex min-h-0 flex-1 flex-col px-6 pb-8">
        <div className="pt-[70px] text-center">
          {userName && (
            <p className="text-[12px] text-gray-400">
              {userName}님
            </p>
          )}

          <p className="mt-2 text-[24px] font-extrabold leading-[1.35] text-gray-900">
            성공적으로
            <br />
            운동을 완료했어요!
          </p>

          <p className="mt-7 text-[11px] text-gray-500">
            총 운동량
          </p>

          <p className="mt-1 text-[24px] font-extrabold text-[#31C66B]">
            {total}
            <span className="ml-1 text-[11px] font-medium">
              kcal
            </span>
          </p>
        </div>

        <div className="mt-10">
          <p className="mb-3 text-[12px] font-bold text-gray-900">
            완료한 루틴
          </p>

          <div className="space-y-2 rounded-[5px] bg-[#FAFAFA] p-3">
            {sessionCompleted.map((r, i) => (
              <RoutineCard
                key={`${r.id}-${i}`}
                routine={r}
              />
            ))}
          </div>
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

export default ExerciseComplete