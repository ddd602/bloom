import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import ScreenHeader from '../components/ScreenHeader'

type Plan =
  | 'yearly'
  | 'monthly'

export default function Membership() {
  const navigate =
    useNavigate()

  const [
    plan,
    setPlan,
  ] =
    useState<Plan>(
      'yearly',
    )

  const [
    message,
    setMessage,
  ] =
    useState('')

  const startTrial =
    () => {
      setMessage(
        '제출용 데모 화면입니다. 실제 결제는 진행되지 않아요.',
      )
    }

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="플랜 변경" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-7">
        <div className="text-center">
          <h1 className="text-[22px] font-extrabold leading-[30px] tracking-[-0.5px] text-gray-900">
            7일 무료체험으로
            <br />
            시작해보세요
          </h1>

          <p className="mt-3 text-[9px] leading-[15px] text-gray-400">
            무료체험 중에는 결제되지 않아요.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() =>
              setPlan(
                'yearly',
              )
            }
            className={
              'relative w-full rounded-[5px] border px-4 py-4 text-left transition ' +
              (
                plan ===
                'yearly'
                  ? 'border-[#31C66B] bg-[#ECF9F0]'
                  : 'border-gray-200 bg-white'
              )
            }
          >
            <span
              className="
                absolute
                -top-3
                left-4
                rounded-full
                bg-[#31C66B]
                px-3
                py-1
                text-[8px]
                font-bold
                text-white
              "
            >
              29% 할인
            </span>

            <div className="flex items-center gap-3">
              <span
                className={
                  'flex h-4 w-4 items-center justify-center rounded-full border ' +
                  (
                    plan ===
                    'yearly'
                      ? 'border-[#31C66B]'
                      : 'border-gray-300'
                  )
                }
              >
                {plan ===
                  'yearly' && (
                  <span className="h-2 w-2 rounded-full bg-[#31C66B]" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-gray-900">
                    연간 프리미엄 플랜
                  </p>

                  <p className="text-[12px] font-bold text-gray-900">
                    ₩33,000
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[8px] text-gray-400">
                    7일 무료체험 / 1년마다 결제
                  </p>

                  <p className="text-[8px] text-gray-300 line-through">
                    ₩46,800
                  </p>
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setPlan(
                'monthly',
              )
            }
            className={
              'w-full rounded-[5px] border px-4 py-4 text-left transition ' +
              (
                plan ===
                'monthly'
                  ? 'border-[#31C66B] bg-[#ECF9F0]'
                  : 'border-gray-200 bg-white'
              )
            }
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  'flex h-4 w-4 items-center justify-center rounded-full border ' +
                  (
                    plan ===
                    'monthly'
                      ? 'border-[#31C66B]'
                      : 'border-gray-300'
                  )
                }
              >
                {plan ===
                  'monthly' && (
                  <span className="h-2 w-2 rounded-full bg-[#31C66B]" />
                )}
              </span>

              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-gray-900">
                    월간 프리미엄 플랜
                  </p>

                  <p className="mt-2 text-[8px] text-gray-400">
                    1개월마다 결제
                  </p>
                </div>

                <p className="text-[12px] font-bold text-gray-900">
                  ₩3,900
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-7 space-y-3">
          {[
            '무제한 루틴으로 효율적인 일상 관리',
            '중요한 루틴은 홈화면으로 잘 보이게',
            '짧은 메모, 긴 메모로 세심하게 기록',
            '매일의 루틴을 한 곳에서 같이 관리',
          ].map(
            (
              item,
            ) => (
              <div
                key={
                  item
                }
                className="flex items-start gap-2"
              >
                <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#31C66B] text-[9px] font-bold text-[#31C66B]">
                  ✓
                </span>

                <p className="text-[10px] leading-[16px] text-gray-700">
                  {
                    item
                  }
                </p>
              </div>
            ),
          )}
        </div>

        {message && (
          <p className="mt-5 rounded-[5px] bg-[#F7F7F7] px-4 py-3 text-center text-[10px] leading-[16px] text-gray-500">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={
            startTrial
          }
          className="
            mt-8
            w-full
            rounded-full
            bg-[#31C66B]
            py-[14px]
            text-[14px]
            font-bold
            text-white
            shadow-[0_5px_14px_rgba(49,198,107,0.24)]
            active:bg-[#2AB760]
          "
        >
          무료체험 시작하기
        </button>

        <div className="mt-4 flex items-center justify-between text-[8px] text-gray-400">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/my-page/terms',
              )
            }
            className="underline underline-offset-2"
          >
            이용약관 및 개인정보처리방침
          </button>

          <button
            type="button"
            onClick={() =>
              setMessage(
                '제출용 데모 화면이라 구매 복원 기능은 연결하지 않았어요.',
              )
            }
            className="underline underline-offset-2"
          >
            구매 내역 복원하기
          </button>
        </div>
      </div>
    </div>
  )
}