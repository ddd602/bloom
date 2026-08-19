import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  getOnboarding,
  saveOnboarding,
  updateOnboarding,
} from '../components/api/OnboardingApi'

import {
  addPeriod,
} from '../components/api/PeriodApi'

import WheelPicker from '../components/onboarding/WheelPicker'
import NudeBodyCamera from '../components/Manage/NudeBodyCamera'

import {
  IconChevronLeft,
} from '../components/icons'

import characterUrl from '../assets/brand/character.svg'

import goalWeightOutline from '../assets/icons/goal-weight-outline.svg'
import goalWeightFilled from '../assets/icons/goal-weight-filled.svg'
import goalLineOutline from '../assets/icons/goal-line-outline.svg'
import goalLineFilled from '../assets/icons/goal-line-filled.svg'
import goalHealthOutline from '../assets/icons/goal-health-outline.svg'
import goalHealthFilled from '../assets/icons/goal-health-filled.svg'
import goalSkinOutline from '../assets/icons/goal-skin-outline.svg'
import goalSkinFilled from '../assets/icons/goal-skin-filled.svg'

import bodyBellyOutline from '../assets/icons/body-belly-outline.svg'
import bodyBellyFilled from '../assets/icons/body-belly-filled.svg'
import bodyChestOutline from '../assets/icons/body-chest-outline.svg'
import bodyChestFilled from '../assets/icons/body-chest-filled.svg'
import bodyHipOutline from '../assets/icons/body-hip-outline.svg'
import bodyHipFilled from '../assets/icons/body-hip-filled.svg'
import bodyThighOutline from '../assets/icons/body-thigh-outline.svg'
import bodyThighFilled from '../assets/icons/body-thigh-filled.svg'
import bodyArmOutline from '../assets/icons/body-arm-outline.svg'
import bodyArmFilled from '../assets/icons/body-arm-filled.svg'
import bodyBackOutline from '../assets/icons/body-back-outline.svg'
import bodyBackFilled from '../assets/icons/body-back-filled.svg'

import condPainOutline from '../assets/icons/cond-pain-outline.svg'
import condPainFilled from '../assets/icons/cond-pain-filled.svg'
import condTiredOutline from '../assets/icons/cond-tired-outline.svg'
import condImbalanceOutline from '../assets/icons/cond-imbalance-outline.svg'
import condImbalanceFilled from '../assets/icons/cond-imbalance-filled.svg'
import condOkOutline from '../assets/icons/cond-ok-outline.svg'
import condOkFilled from '../assets/icons/cond-ok-filled.svg'

import skinElasticOutline from '../assets/icons/skin-elastic-outline.svg'
import skinElasticFilled from '../assets/icons/skin-elastic-filled.svg'
import skinStretchOutline from '../assets/icons/skin-stretch-outline.svg'
import skinStretchFilled from '../assets/icons/skin-stretch-filled.svg'
import skinAcneOutline from '../assets/icons/skin-acne-outline.svg'
import skinAcneFilled from '../assets/icons/skin-acne-filled.svg'
import skinSwirlOutline from '../assets/icons/skin-swirl-outline.svg'
import skinSwirlFilled from '../assets/icons/skin-swirl-filled.svg'

const range = (
  from: number,
  to: number,
) =>
  Array.from(
    {
      length:
        to - from + 1,
    },
    (_, index) =>
      from + index,
  )

const YEARS =
  range(1970, 2012)

const DUE_YEARS =
  range(2015, 2026)

const MONTHS =
  range(1, 12)

const DAYS =
  range(1, 31)

const HEIGHTS =
  range(130, 200)

const WEIGHTS =
  range(35, 120)

type Option = {
  id: string
  label: string

  img?: {
    outline: string
    filled: string
  }

  icon?: (
    color: string,
  ) => ReactNode
}

type SelectStep = {
  key: string
  title: string[]
  subtitle?: string
  options: Option[]
}

const SELECT_STEPS: SelectStep[] = [
  {
    key: 'goal',

    title: [
      'BLOOM에서 어떤 변화를',
      '기대하나요?',
    ],

    subtitle:
      '목표를 모두 선택해주세요 (중복 선택 가능)',

    options: [
      {
        id: 'weight',
        label: '체중 감량',
        img: {
          outline:
            goalWeightOutline,
          filled:
            goalWeightFilled,
        },
      },

      {
        id: 'line',
        label: '라인 관리',
        img: {
          outline:
            goalLineOutline,
          filled:
            goalLineFilled,
        },
      },

      {
        id: 'health',
        label: '건강 회복',
        img: {
          outline:
            goalHealthOutline,
          filled:
            goalHealthFilled,
        },
      },

      {
        id: 'skin',
        label: '피부 관리',
        img: {
          outline:
            goalSkinOutline,
          filled:
            goalSkinFilled,
        },
      },
    ],
  },

  {
    key: 'focus',

    title: [
      '집중 관리하고 싶은',
      '부위가 있나요?',
    ],

    subtitle:
      'AI가 부위에 맞는 운동을 추천해드릴게요',

    options: [
      {
        id: 'abdomen',
        label: '복부',
        img: {
          outline:
            bodyBellyOutline,
          filled:
            bodyBellyFilled,
        },
      },

      {
        id: 'upper',
        label: '상체 · 가슴',
        img: {
          outline:
            bodyChestOutline,
          filled:
            bodyChestFilled,
        },
      },

      {
        id: 'pelvis',
        label: '골반 · 힙',
        img: {
          outline:
            bodyHipOutline,
          filled:
            bodyHipFilled,
        },
      },

      {
        id: 'thigh',
        label: '허벅지',
        img: {
          outline:
            bodyThighOutline,
          filled:
            bodyThighFilled,
        },
      },
    ],
  },

  {
    key: 'recover',

    title: [
      '지금 가장 회복하고 싶은',
      '부위가 있나요?',
    ],

    subtitle:
      '현재 몸 상태에 맞는 관리법을 추천해드릴게요',

    options: [
      {
        id: 'arm',
        label: '체력',
        img: {
          outline:
            bodyArmOutline,
          filled:
            bodyArmFilled,
        },
      },

      {
        id: 'core',
        label: '코어',
        img: {
          outline:
            bodyBellyOutline,
          filled:
            bodyBellyFilled,
        },
      },

      {
        id: 'pelvis',
        label: '골반',
        img: {
          outline:
            bodyHipOutline,
          filled:
            bodyHipFilled,
        },
      },

      {
        id: 'neck',
        label:
          '목 · 어깨 · 허리',
        img: {
          outline:
            bodyBackOutline,
          filled:
            bodyBackFilled,
        },
      },
    ],
  },

  {
    key: 'condition',

    title: [
      '운동 전 몸 상태를',
      '확인할게요',
    ],

    subtitle:
      '현재 느끼는 불편함을 알려주시면 운동 강도를 조절할게요',

    options: [
      {
        id: 'pain',
        label:
          '출산 또는 수술 부위에 통증이 있어요',
        img: {
          outline:
            condPainOutline,
          filled:
            condPainFilled,
        },
      },

      {
        id: 'tired',
        label:
          '쉽게 피로하거나 체력이 부족해요',
        img: {
          outline:
            condTiredOutline,
          filled:
            condTiredOutline,
        },
      },

      {
        id: 'balance',
        label:
          '골반 또는 허리 등 몸의 균형이 불편해요',
        img: {
          outline:
            condImbalanceOutline,
          filled:
            condImbalanceFilled,
        },
      },

      {
        id: 'ok',
        label:
          '특별한 문제 없이 운동을 할 수 있어요',
        img: {
          outline:
            condOkOutline,
          filled:
            condOkFilled,
        },
      },
    ],
  },

  {
    key: 'skin',

    title: [
      '개선하고 싶은',
      '피부 고민이 있나요?',
    ],

    subtitle:
      '현재 피부 상태를 알려주시면 관리에 참고할게요',

    options: [
      {
        id: 'elastic',
        label:
          '탄력 · 처짐',
        img: {
          outline:
            skinElasticOutline,
          filled:
            skinElasticFilled,
        },
      },

      {
        id: 'stretch',
        label: '튼살',
        img: {
          outline:
            skinStretchOutline,
          filled:
            skinStretchFilled,
        },
      },

      {
        id: 'acne',
        label:
          '색소 · 잡티',
        img: {
          outline:
            skinAcneOutline,
          filled:
            skinAcneFilled,
        },
      },

      {
        id: 'dry',
        label:
          '건조 · 민감',
        img: {
          outline:
            skinSwirlOutline,
          filled:
            skinSwirlFilled,
        },
      },
    ],
  },
]

const LAST = 10

function toKey(
  year: number,
  month: number,
  day: number,
) {
  return `${year}-${String(
    month + 1,
  ).padStart(
    2,
    '0',
  )}-${String(
    day,
  ).padStart(
    2,
    '0',
  )}`
}

function makeDateKey(
  year: number,
  month: number,
  day: number,
) {
  return `${year}-${String(
    month,
  ).padStart(
    2,
    '0',
  )}-${String(
    day,
  ).padStart(
    2,
    '0',
  )}`
}

export default function Onboarding() {
  const navigate =
    useNavigate()

  const [
    searchParams,
  ] = useSearchParams()

  const isEditMode =
    searchParams.get(
      'mode',
    ) === 'edit'

  const [
    step,
    setStep,
  ] = useState(0)

  const [
    year,
    setYear,
  ] = useState(2000)

  const [
    month,
    setMonth,
  ] = useState(1)

  const [
    day,
    setDay,
  ] = useState(1)

  const [
    birthTouched,
    setBirthTouched,
  ] = useState(false)

  const [
    dueYear,
    setDueYear,
  ] = useState(2024)

  const [
    dueMonth,
    setDueMonth,
  ] = useState(1)

  const [
    dueDay,
    setDueDay,
  ] = useState(1)

  const [
    dueTouched,
    setDueTouched,
  ] = useState(false)

  const [
    height,
    setHeight,
  ] = useState(165)

  const [
    weight,
    setWeight,
  ] = useState(60)

  const [
    answers,
    setAnswers,
  ] =
    useState<
      Record<
        string,
        string[]
      >
    >({})

  const [
    photo,
    setPhoto,
  ] =
    useState<
      string | undefined
    >(undefined)

  const [
    pendingPhotoFile,
    setPendingPhotoFile,
  ] =
    useState<
      File | null
    >(null)

  const [
    cameraOpen,
    setCameraOpen,
  ] = useState(false)

  const [
    pStart,
    setPStart,
  ] =
    useState<
      string | null
    >(null)

  const [
    pEnd,
    setPEnd,
  ] =
    useState<
      string | null
    >(null)

  useEffect(() => {
    if (!isEditMode) {
      return
    }

    let cancelled = false

    const loadExisting =
      async () => {
        try {
          const data =
            await getOnboarding()

          if (cancelled) {
            return
          }

          const [
            birthYear,
            birthMonth,
            birthDay,
          ] =
            data.birthDate
              .split('-')
              .map(Number)

          const [
            deliveryYear,
            deliveryMonth,
            deliveryDay,
          ] =
            data.dueDate
              .split('-')
              .map(Number)

          if (
            birthYear &&
            birthMonth &&
            birthDay
          ) {
            setYear(
              birthYear,
            )

            setMonth(
              birthMonth,
            )

            setDay(
              birthDay,
            )

            setBirthTouched(
              true,
            )
          }

          if (
            deliveryYear &&
            deliveryMonth &&
            deliveryDay
          ) {
            setDueYear(
              deliveryYear,
            )

            setDueMonth(
              deliveryMonth,
            )

            setDueDay(
              deliveryDay,
            )

            setDueTouched(
              true,
            )
          }

          setHeight(
            data.height,
          )

          setWeight(
            data.weight,
          )

          setAnswers({
            goal:
              data.goals ?? [],
            focus:
              data.focusAreas ?? [],
            recover:
              data.recoveryAreas ?? [],
            condition:
              data.conditions ?? [],
            skin:
              data.skinConcerns ?? [],
          })

          // 프로필 수정에서는 기존 생리 기록을 새로 생성하지 않음
          setPStart(
            null,
          )

          setPEnd(
            null,
          )
        } catch (error) {
          console.error(
            '기존 프로필 정보를 불러오지 못했습니다.',
            error,
          )
        }
      }

    void loadExisting()

    return () => {
      cancelled = true
    }
  }, [isEditMode])

  const toggle = (
    key: string,
    id: string,
  ) => {
    setAnswers(
      (current) => {
        const selected =
          current[key] ??
          []

        return {
          ...current,

          [key]:
            selected.includes(
              id,
            )
              ? selected.filter(
                  (item) =>
                    item !== id,
                )
              : [
                  ...selected,
                  id,
                ],
        }
      },
    )
  }

  // =============================
  // 생리 주기
  // =============================

  const today =
    new Date()

  const vy =
    today.getFullYear()

  const vm =
    today.getMonth()

  const firstOffset =
    (
      new Date(
        vy,
        vm,
        1,
      ).getDay() +
      6
    ) %
    7

  const daysInMonth =
    new Date(
      vy,
      vm + 1,
      0,
    ).getDate()

  const cells:
    (
      | number
      | null
    )[] = [
    ...Array(
      firstOffset,
    ).fill(
      null,
    ),

    ...range(
      1,
      daysInMonth,
    ),
  ]

  const pickDay = (
    selectedDay: number,
  ) => {
    const key =
      toKey(
        vy,
        vm,
        selectedDay,
      )

    if (
      !pStart ||
      (
        pStart &&
        pEnd
      )
    ) {
      setPStart(
        key,
      )

      setPEnd(
        null,
      )

      return
    }

    if (
      key <
      pStart
    ) {
      setPEnd(
        pStart,
      )

      setPStart(
        key,
      )
    } else {
      setPEnd(
        key,
      )
    }
  }

  const inRange = (
    selectedDay: number,
  ) => {
    const key =
      toKey(
        vy,
        vm,
        selectedDay,
      )

    if (
      pStart &&
      pEnd
    ) {
      return (
        key >=
          pStart &&
        key <=
          pEnd
      )
    }

    return (
      key ===
      pStart
    )
  }

  // =============================
  // 눈바디
  // =============================

  const replacePhotoPreview = (
    file: File,
    previewUrl: string,
  ) => {
    if (
      photo?.startsWith(
        'blob:',
      )
    ) {
      URL.revokeObjectURL(
        photo,
      )
    }

    setPendingPhotoFile(
      file,
    )

    setPhoto(
      previewUrl,
    )
  }

  const onCaptureDirect = (
    file: File,
    previewUrl: string,
  ) => {
    replacePhotoPreview(
      file,
      previewUrl,
    )

    setCameraOpen(
      false,
    )
  }

  const onPickGallery = (
    e:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0]

    if (!file) return

    const previewUrl =
      URL.createObjectURL(
        file,
      )

    replacePhotoPreview(
      file,
      previewUrl,
    )

    e.target.value = ''
  }

  // =============================
  // 저장
  // =============================

  const finish =
    async () => {
      try {
        const profileData = {
          birthDate:
            makeDateKey(
              year,
              month,
              day,
            ),

          dueDate:
            makeDateKey(
              dueYear,
              dueMonth,
              dueDay,
            ),

          height,
          weight,

          goals:
            answers.goal ??
            [],

          focusAreas:
            answers.focus ??
            [],

          recoveryAreas:
            answers.recover ??
            [],

          conditions:
            answers.condition ??
            [],

          skinConcerns:
            answers.skin ??
            [],
        }

        if (isEditMode) {
          await updateOnboarding(
            profileData,
          )
        } else {
          await saveOnboarding(
            profileData,
          )
        }

        // 현재 배포 Swagger에는 이미지 파일 업로드 API가 없습니다.
        // pendingPhotoFile은 온보딩 중 미리보기 용도로만 유지하고,
        // 실제 https 이미지 URL을 얻기 전에는 body-check 서버 저장을 하지 않습니다.
        void pendingPhotoFile

        if (
          !isEditMode &&
          pStart
        ) {
          await addPeriod({
            start:
              pStart,

            end:
              pEnd ??
              pStart,
          })
        }

        navigate(
          isEditMode
            ? '/my-page/profile-settings'
            : '/home',
          {
            replace:
              true,
          },
        )
      } catch (
        error
      ) {
        console.error(
          '온보딩 정보를 저장하지 못했습니다.',
          error,
        )
      }
    }

  const isSelect =
    step >= 3 &&
    step <= 7

  const canNext =
    (() => {
      if (
        step === 0
      ) {
        return birthTouched
      }

      if (
        step === 1
      ) {
        return dueTouched
      }

      if (
        isSelect
      ) {
        const config =
          SELECT_STEPS[
            step - 3
          ]

        return (
          (
            answers[
              config.key
            ]?.length ??
            0
          ) >
          0
        )
      }

      if (
        step === 8
      ) {
        return true
      }

      if (
        step === 9
      ) {
        return isEditMode
          ? true
          : !!pStart
      }

      return true
    })()

  const next = () => {
    if (
      !canNext
    ) {
      return
    }

    if (
      step <
      LAST
    ) {
      setStep(
        step + 1,
      )
    } else {
      finish()
    }
  }

  const back = () => {
    if (
      step > 0
    ) {
      setStep(
        step - 1,
      )
    } else {
      navigate(-1)
    }
  }

  const NextButton = ({
    className = '',
  }: {
    className?: string
  }) => (
    <button
      type="button"
      onClick={
        next
      }
      disabled={
        !canNext
      }
      className={
        'h-[48px] w-full rounded-full text-[14px] font-semibold transition-colors ' +
        (
          canNext
            ? 'bg-[#31C66B] text-white'
            : 'bg-[#B7B7B7] text-white'
        ) +
        ' ' +
        className
      }
    >
      다음
    </button>
  )

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-white">
      {/* 카메라 */}
      {cameraOpen && (
        <NudeBodyCamera
          onCapture={
            onCaptureDirect
          }
          onClose={() =>
            setCameraOpen(
              false,
            )
          }
        />
      )}

      {/* 뒤로가기 */}
      {step !== LAST && (
        <header
          className="shrink-0 px-5"
          style={{
            paddingTop:
              'calc(env(safe-area-inset-top) + 18px)',
          }}
        >
          <button
            type="button"
            onClick={
              back
            }
            aria-label="뒤로가기"
            className="flex h-7 w-7 items-center justify-center text-[#777]"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>
        </header>
      )}

      {/* =========================
          0. 생년월일
      ========================= */}
      {step === 0 && (
        <main className="min-h-0 flex-1 px-7 pt-[58px]">
          <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
            생년월일을
            <br />
            입력해주세요!
          </h1>

          <p className="mt-[7px] text-[7px] text-[#B3B3B3]">
            생년월일을 입력해주세요
          </p>

          {/* 날짜 입력 + 다음 */}
          <div className="mt-[56px]">
            <div className="flex h-[54px] w-full items-center rounded-[4px] bg-[#F1F1F1] px-[10px]">
              {/* 년 */}
              <div className="min-w-0 flex-[1.45]">
                <WheelPicker
                  compact
                  active={
                    birthTouched
                  }
                  values={
                    YEARS
                  }
                  value={
                    year
                  }
                  onChange={(
                    value,
                  ) => {
                    setYear(
                      value as number,
                    )

                    setBirthTouched(
                      true,
                    )
                  }}
                />
              </div>

              <span className="w-[18px] shrink-0 text-center text-[10px] text-[#777]">
                /
              </span>

              {/* 월 */}
              <div className="min-w-0 flex-1">
                <WheelPicker
                  compact
                  active={
                    birthTouched
                  }
                  values={
                    MONTHS
                  }
                  value={
                    month
                  }
                  onChange={(
                    value,
                  ) => {
                    setMonth(
                      value as number,
                    )

                    setBirthTouched(
                      true,
                    )
                  }}
                />
              </div>

              <span className="w-[18px] shrink-0 text-center text-[10px] text-[#777]">
                /
              </span>

              {/* 일 */}
              <div className="min-w-0 flex-1">
                <WheelPicker
                  compact
                  active={
                    birthTouched
                  }
                  values={
                    DAYS
                  }
                  value={
                    day
                  }
                  onChange={(
                    value,
                  ) => {
                    setDay(
                      value as number,
                    )

                    setBirthTouched(
                      true,
                    )
                  }}
                />
              </div>
            </div>

            <NextButton className="mt-[10px]" />
          </div>
        </main>
      )}

      {/* =========================
          1. 출산일
      ========================= */}
      {step === 1 && (
        <main className="min-h-0 flex-1 px-7 pt-[58px]">
          <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
            출산일을
            <br />
            입력해주세요!
          </h1>

          <p className="mt-[7px] text-[7px] text-[#B3B3B3]">
            실제 출산일을 입력해주세요
          </p>

          <div className="mt-[56px]">
            <div className="flex h-[54px] w-full items-center rounded-[4px] bg-[#F1F1F1] px-[10px]">
              <div className="min-w-0 flex-[1.45]">
                <WheelPicker
                  compact
                  active={
                    dueTouched
                  }
                  values={
                    DUE_YEARS
                  }
                  value={
                    dueYear
                  }
                  onChange={(
                    value,
                  ) => {
                    setDueYear(
                      value as number,
                    )

                    setDueTouched(
                      true,
                    )
                  }}
                />
              </div>

              <span className="w-[18px] shrink-0 text-center text-[10px] text-[#777]">
                /
              </span>

              <div className="min-w-0 flex-1">
                <WheelPicker
                  compact
                  active={
                    dueTouched
                  }
                  values={
                    MONTHS
                  }
                  value={
                    dueMonth
                  }
                  onChange={(
                    value,
                  ) => {
                    setDueMonth(
                      value as number,
                    )

                    setDueTouched(
                      true,
                    )
                  }}
                />
              </div>

              <span className="w-[18px] shrink-0 text-center text-[10px] text-[#777]">
                /
              </span>

              <div className="min-w-0 flex-1">
                <WheelPicker
                  compact
                  active={
                    dueTouched
                  }
                  values={
                    DAYS
                  }
                  value={
                    dueDay
                  }
                  onChange={(
                    value,
                  ) => {
                    setDueDay(
                      value as number,
                    )

                    setDueTouched(
                      true,
                    )
                  }}
                />
              </div>
            </div>

            <NextButton className="mt-[10px]" />
          </div>
        </main>
      )}

      {/* =========================
          2. 키 / 몸무게
      ========================= */}
      {step === 2 && (
        <>
          <main className="min-h-0 flex-1 px-7 pt-[58px]">
            <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
              최근 측정한 키와 체중을
              <br />
              입력해주세요!
            </h1>

            <p className="mt-[7px] text-[7px] text-[#B3B3B3]">
              가장 최근 측정한 값을 선택해주세요
            </p>

            <div className="mt-[48px] flex gap-[34px] px-3">
              {/* 키 */}
              <div className="min-w-0 flex-1">
                <p className="mb-[10px] text-center text-[11px] font-semibold text-[#222]">
                  키
                </p>

                <WheelPicker
                  values={
                    HEIGHTS
                  }
                  value={
                    height
                  }
                  unit="cm"
                  onChange={(
                    value,
                  ) =>
                    setHeight(
                      value as number,
                    )
                  }
                />
              </div>

              {/* 체중 */}
              <div className="min-w-0 flex-1">
                <p className="mb-[10px] text-center text-[11px] font-semibold text-[#222]">
                  체중
                </p>

                <WheelPicker
                  values={
                    WEIGHTS
                  }
                  value={
                    weight
                  }
                  unit="kg"
                  onChange={(
                    value,
                  ) =>
                    setWeight(
                      value as number,
                    )
                  }
                />
              </div>
            </div>
          </main>

          <footer className="shrink-0 px-7 pb-8">
            <NextButton />
          </footer>
        </>
      )}

      {/* =========================
          3~7. 선택 화면
      ========================= */}
      {isSelect &&
        (() => {
          const config =
            SELECT_STEPS[
              step - 3
            ]

          const selected =
            answers[
              config.key
            ] ?? []

          return (
            <>
              <main className="min-h-0 flex-1 overflow-y-auto px-7 pt-[50px]">
                <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
                  {
                    config
                      .title[0]
                  }

                  <br />

                  {
                    config
                      .title[1]
                  }
                </h1>

                <p className="mt-[7px] min-h-[14px] text-[7px] leading-[12px] text-[#B3B3B3]">
                  {
                    config.subtitle ??
                    ' '
                  }
                </p>

                <div className="mt-[37px] space-y-[8px]">
                  {config.options.map(
                    (
                      option,
                    ) => {
                      const active =
                        selected.includes(
                          option.id,
                        )

                      return (
                        <button
                          key={
                            option.id
                          }
                          type="button"
                          onClick={() =>
                            toggle(
                              config.key,
                              option.id,
                            )
                          }
                          className={
                            'flex h-[55px] w-full items-center gap-[14px] rounded-[3px] border px-[15px] text-left text-[11px] font-medium transition-colors ' +
                            (
                              active
                                ? 'border-[#67DB97] bg-[#EAF8EE] text-[#31C66B]'
                                : 'border-transparent bg-[#FAFAFA] text-[#777]'
                            )
                          }
                        >
                          {option.img && (
                            <img
                              src={
                                active
                                  ? option
                                      .img
                                      .filled
                                  : option
                                      .img
                                      .outline
                              }
                              alt=""
                              className="h-[19px] w-[19px] shrink-0 object-contain"
                            />
                          )}

                          {option.icon?.(
                            active
                              ? '#31C66B'
                              : '#8B8B8B',
                          )}

                          <span>
                            {
                              option.label
                            }
                          </span>
                        </button>
                      )
                    },
                  )}
                </div>
              </main>

              <footer className="shrink-0 px-7 pb-8 pt-4">
                <NextButton />
              </footer>
            </>
          )
        })()}

      {/* =========================
          8. 눈바디
      ========================= */}
      {step === 8 && (
        <>
          <main className="min-h-0 flex-1 px-7 pt-[50px]">
            <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
              운동 전 몸상태를
              <br />
              기록해볼게요
            </h1>

            <p className="mt-[7px] text-[7px] text-[#B3B3B3]">
              눈바디 사진은 나만 볼 수 있어요
            </p>

            <div className="mt-[52px] flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setCameraOpen(
                    true,
                  )
                }
                className="
                  flex
                  h-[145px]
                  w-[145px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-[#E5E5E5]
                  text-white
                "
              >
                {photo ? (
                  <img
                    src={
                      photo
                    }
                    alt="눈바디"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />

                    <circle
                      cx="12"
                      cy="13"
                      r="3.2"
                    />
                  </svg>
                )}
              </button>

              <label className="mt-5 cursor-pointer text-[10px] text-gray-500">
                갤러리에서 선택

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    onPickGallery
                  }
                />
              </label>

              {pendingPhotoFile && (
                <p className="mt-3 text-center text-[8px] leading-[12px] text-gray-400">
                  현재는 미리보기만 저장돼요.
                  <br />
                  서버 이미지 업로드 API 연결 후 영구 저장할 수 있어요.
                </p>
              )}
            </div>
          </main>

          <footer className="shrink-0 px-7 pb-8">
            <NextButton />
          </footer>
        </>
      )}

      {/* =========================
          9. 생리주기
      ========================= */}
      {step === 9 && (
        <>
          <main className="min-h-0 flex-1 overflow-y-auto px-6 pt-[35px]">
            <h1 className="text-[19px] font-bold leading-[25px] text-[#111]">
              최근 생리주기를
              <br />
              알려주세요
            </h1>

            <p className="mt-[7px] text-[7px] text-[#B3B3B3]">
              날짜를 선택하면 이후 관리에 반영할 수 있어요
            </p>

            <div className="mt-9 text-[12px] font-bold text-[#222]">
              {vy}년{' '}
              {vm + 1}월
            </div>

            <div className="mt-5 grid grid-cols-7 text-center text-[8px] text-[#888]">
              {[
                'MON',
                'TUE',
                'WED',
                'THU',
                'FRI',
                'SAT',
                'SUN',
              ].map(
                (
                  weekday,
                ) => (
                  <div
                    key={
                      weekday
                    }
                  >
                    {
                      weekday
                    }
                  </div>
                ),
              )}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-y-[17px]">
              {cells.map(
                (
                  cell,
                  index,
                ) =>
                  cell ===
                  null ? (
                    <div
                      key={
                        index
                      }
                      className="h-7"
                    />
                  ) : (
                    <button
                      key={
                        index
                      }
                      type="button"
                      onClick={() =>
                        pickDay(
                          cell,
                        )
                      }
                      className="relative flex h-7 items-center justify-center"
                    >
                      {inRange(
                        cell,
                      ) && (
                        <span className="absolute inset-x-0 h-[18px] bg-[#EEF9F1]" />
                      )}

                      <span className="relative z-10 flex h-6 w-6 items-center justify-center text-[10px] text-[#777]">
                        {
                          cell
                        }
                      </span>
                    </button>
                  ),
              )}
            </div>
          </main>

          <footer className="shrink-0 px-7 pb-8 pt-3">
            <NextButton />
          </footer>
        </>
      )}

      {/* =========================
          10. 완료
      ========================= */}
      {step === LAST && (
        <>
          <main
            className="
              flex
              min-h-0
              flex-1
              flex-col
              items-center
              bg-gradient-to-b
              from-[#EFFCF3]
              via-white
              to-white
              px-7
              pt-[120px]
              text-center
            "
          >
            <h1 className="text-[21px] font-bold text-[#111]">
              {isEditMode
                ? '정보 수정이 완료됐어요!'
                : '설정이 완료 됐어요!'}
            </h1>

            <p className="mt-2 text-[11px] text-gray-500">
              {isEditMode
                ? '변경한 정보가 프로필에 반영됐어요.'
                : '이제 나를 위한 시간을 시작해보세요!'}
            </p>

            <img
              src={
                characterUrl
              }
              alt="BLOOM 캐릭터"
              className="mt-[62px] h-[180px] object-contain"
            />
          </main>

          <footer
            className="shrink-0 bg-white px-7 pt-3"
            style={{
              paddingBottom:
                'calc(env(safe-area-inset-bottom) + 28px)',
            }}
          >
            <button
              type="button"
              onClick={
                finish
              }
              className="h-[48px] w-full rounded-full bg-[#31C66B] text-[14px] font-semibold text-white"
            >
              {isEditMode
                ? '수정 완료'
                : '관리 시작하기'}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}