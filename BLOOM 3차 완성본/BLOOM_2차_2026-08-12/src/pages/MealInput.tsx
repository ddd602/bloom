import { useEffect, useState } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import CameraScan from '../components/Meal/CameraScan'

import {
  saveMeal,
  getMealsByDate,
  type MealItem,
  type MealKey,
  type MealType,
} from '../components/api/MealApi'

import {
  analyzeNutritionImage,
  analyzeNutritionText,
  getNutritionAnalysis,
  updateNutritionDraftFood,
  addNutritionDraftFood,
  deleteNutritionDraftFood,
  recordNutritionAnalysis,
  type NutritionFoodSource,
} from '../components/api/AiNutritionApi'

import { IconChevronLeft } from '../components/icons'

function isMealKey(
  v: string | undefined,
): v is MealKey {
  return (
    v === 'breakfast' ||
    v === 'lunch' ||
    v === 'dinner'
  )
}

function getTodayDate() {
  const today = new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() + 1,
    ).padStart(
      2,
      '0',
    )

  const day =
    String(
      today.getDate(),
    ).padStart(
      2,
      '0',
    )

  return `${year}-${month}-${day}`
}


const MEAL_TYPE_BY_KEY:
  Record<
    MealKey,
    MealType
  > = {
  breakfast:
    'BREAKFAST',
  lunch:
    'LUNCH',
  dinner:
    'DINNER',
}


const waitForNutritionAnalysis =
  async (
    initialResult: Awaited<
      ReturnType<
        typeof analyzeNutritionText
      >
    >,
  ) => {
    if (
      initialResult.status !==
      'PROCESSING'
    ) {
      return initialResult
    }

    let latest =
      initialResult

    // 백엔드 AI 분석이 비동기인 경우를 대비해
    // 최대 약 10초 동안 결과를 확인합니다.
    for (
      let attempt = 0;
      attempt < 10;
      attempt += 1
    ) {
      await new Promise<void>(
        (resolve) =>
          window.setTimeout(
            resolve,
            1000,
          ),
      )

      latest =
        await getNutritionAnalysis(
          initialResult.analysisId,
        )

      if (
        latest.status !==
        'PROCESSING'
      ) {
        break
      }
    }

    return latest
  }

type EditableMealItem =
  Omit<MealItem, 'kcal'> & {
    kcal: number | null
    draftFoodId?: number
    source?: NutritionFoodSource
    confidence?: number | null
  }

export default function MealInput() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const params =
    useParams()

  const key: MealKey =
    isMealKey(
      params.type,
    )
      ? params.type
      : 'breakfast'

  const selectedDate =
    location.state
      ?.selectedDate ??
    getTodayDate()

  const [
    tab,
    setTab,
  ] =
    useState<
      'manual' | 'ai'
    >('manual')

  const [
    scanned,
    setScanned,
  ] =
    useState(false)

  const [
    photo,
    setPhoto,
  ] =
    useState<
      string | undefined
    >(undefined)

  const [
    items,
    setItems,
  ] =
    useState<
      EditableMealItem[]
    >([])

  const [
    analysisId,
    setAnalysisId,
  ] =
    useState<
      number | null
    >(null)

  const [
    deletedDraftFoodIds,
    setDeletedDraftFoodIds,
  ] =
    useState<
      number[]
    >([])

  const [
    analyzing,
    setAnalyzing,
  ] =
    useState(false)

  const [
    analysisError,
    setAnalysisError,
  ] =
    useState('')

  const [
    cameraOpen,
    setCameraOpen,
  ] =
    useState(false)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        (item.kcal ?? 0),
      0,
    )

  const showCamera =
    tab === 'ai' &&
    !scanned

  // ==============================
  // 기존 식사 기록 조회
  // ==============================

  useEffect(() => {
    const loadExistingMeal =
      async () => {
        try {
          const result =
            await getMealsByDate(
              selectedDate,
            )

          const existing =
            result.meals[
            key
            ]

          setItems(
            existing.items,
          )

          setScanned(
            existing.items
              .length > 0,
          )
        } catch (error) {
          console.error(
            '식사 기록을 불러오지 못했습니다.',
            error,
          )

          setItems([])
          setScanned(false)
        }
      }

    loadExistingMeal()
  }, [
    key,
    selectedDate,
  ])

  const applyAnalysisResult = (
    result: Awaited<
      ReturnType<
        typeof analyzeNutritionImage
      >
    >,
  ) => {
    setAnalysisId(
      result.analysisId,
    )

    setDeletedDraftFoodIds(
      [],
    )

    setItems(
      result.foods.map(
        (food) => ({
          draftFoodId:
            food.draftFoodId,
          name:
            food.foodName,
          kcal:
            food.kcal,
          carbs:
            food.carbs,
          protein:
            food.protein,
          fat:
            food.fat,
          source:
            food.source,
          confidence:
            food.confidence,
        }),
      ),
    )

    setScanned(
      true,
    )

    if (
      result.status ===
      'FAILED' ||
      result.manualInputAvailable
    ) {
      setAnalysisError(
        '음식을 인식하지 못했어요. 직접 입력해주세요.',
      )
    }
  }

  // ==============================
  // AI 이미지 분석
  // ==============================

  const analyzeImage =
    async (
      file: File,
      previewUrl: string,
    ) => {
      if (analyzing) {
        return
      }

      if (
        photo?.startsWith(
          'blob:',
        )
      ) {
        URL.revokeObjectURL(
          photo,
        )
      }

      setPhoto(
        previewUrl,
      )

      setAnalysisError('')
      setAnalyzing(true)

      try {
        const result =
          await analyzeNutritionImage(
            selectedDate,
            MEAL_TYPE_BY_KEY[
            key
            ],
            file,
          )

        applyAnalysisResult(
          result,
        )
      } catch (error) {
        console.error(
          'AI 식단 분석에 실패했습니다.',
          error,
        )

        setAnalysisError(
          error instanceof Error
            ? error.message
            : 'AI 식단 분석에 실패했습니다.',
        )
      } finally {
        setAnalyzing(
          false,
        )

        setCameraOpen(
          false,
        )
      }
    }

  // ==============================
  // AI 촬영
  // ==============================

  const onCapture = (
    file: File,
    previewUrl: string,
  ) => {
    void analyzeImage(
      file,
      previewUrl,
    )
  }

  // ==============================
  // 갤러리
  // ==============================

  const onUpload = (
    e:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0]

    if (!file) {
      return
    }

    const previewUrl =
      URL.createObjectURL(
        file,
      )

    if (tab === 'ai') {
      void analyzeImage(
        file,
        previewUrl,
      )
    } else {
      if (
        photo?.startsWith(
          'blob:',
        )
      ) {
        URL.revokeObjectURL(
          photo,
        )
      }

      setPhoto(
        previewUrl,
      )
    }

    e.target.value = ''
  }

  // ==============================
  // 직접 촬영
  // ==============================

  const onCaptureDirect = (
    file: File,
    previewUrl: string,
  ) => {
    if (tab === 'ai') {
      void analyzeImage(
        file,
        previewUrl,
      )

      return
    }

    if (
      photo?.startsWith(
        'blob:',
      )
    ) {
      URL.revokeObjectURL(
        photo,
      )
    }

    setPhoto(
      previewUrl,
    )

    setCameraOpen(
      false,
    )
  }

  // ==============================
  // 음식명 변경
  // ==============================

  const setName = (
    i: number,
    name: string,
  ) => {
    setItems(
      items.map(
        (
          item,
          index,
        ) =>
          index === i
            ? {
              ...item,
              name,
            }
            : item,
      ),
    )
  }

  // ==============================
  // 칼로리 변경
  // ==============================

  const setKcal = (
    i: number,
    kcal: string,
  ) => {
    setItems(
      items.map(
        (
          item,
          index,
        ) =>
          index === i
            ? {
              ...item,

              kcal:
                kcal.trim() === ''
                  ? null
                  : Number(kcal),
            }
            : item,
      ),
    )
  }

  // ==============================
  // 음식 삭제
  // ==============================

  const remove = (
    i: number,
  ) => {
    const target =
      items[i]

    if (
      target?.draftFoodId !==
      undefined
    ) {
      setDeletedDraftFoodIds(
        (prev) => [
          ...prev,
          target.draftFoodId!,
        ],
      )
    }

    setItems(
      items.filter(
        (
          _,
          index,
        ) =>
          index !== i,
      ),
    )
  }

  // ==============================
  // 음식 추가
  // ==============================

  const add = () => {
    setItems([
      ...items,
      {
        name: '',
        kcal: null,
        source:
          analysisId !== null
            ? 'USER_INPUT'
            : undefined,
      },
    ])
  }

  // ==============================
  // 식단 저장
  //
  // 저장하기 버튼을 눌렀을 때만
  // 서버에 저장
  // ==============================

  const save =
    async () => {
      if (saving) {
        return
      }

      const cleaned =
        items.filter(
          (item) =>
            item.name
              .trim() !==
            '',
        )

      try {
        setSaving(
          true,
        )

        if (
          analysisId !== null
        ) {
          await Promise.all(
            deletedDraftFoodIds.map(
              (draftFoodId) =>
                deleteNutritionDraftFood(
                  analysisId,
                  draftFoodId,
                ),
            ),
          )

          await Promise.all(
            cleaned.map(
              (item) => {
                const data = {
                  foodName:
                    item.name.trim(),
                  kcal:
                    item.kcal,
                  carbs:
                    item.carbs ?? null,
                  protein:
                    item.protein ?? null,
                  fat:
                    item.fat ?? null,
                }

                if (
                  item.draftFoodId !==
                  undefined
                ) {
                  return updateNutritionDraftFood(
                    analysisId,
                    item.draftFoodId,
                    data,
                  )
                }

                return addNutritionDraftFood(
                  analysisId,
                  data,
                )
              },
            ),
          )

          await recordNutritionAnalysis(
            analysisId,
          )
        } else if (tab === 'manual') {
          if (cleaned.length === 0) {
            setAnalysisError(
              '음식 이름을 입력해주세요.',
            )
            return
          }

          setAnalysisError('')

          // 이미 저장된 식사를 수정하는 경우에는
          // 기존 saveMeal 동작을 그대로 유지합니다.
          const isEditingExistingMeal =
            cleaned.some(
              (item) =>
                item.mealId !==
                undefined,
            )

          if (
            isEditingExistingMeal
          ) {
            await saveMeal(
              selectedDate,
              key,
              {
                items:
                  cleaned.map(
                    (item) => ({
                      mealId:
                        item.mealId,
                      name:
                        item.name.trim(),
                      kcal:
                        item.kcal ??
                        0,
                      carbs:
                        item.carbs,
                      protein:
                        item.protein,
                      fat:
                        item.fat,
                    }),
                  ),
              },
            )
          } else {
            try {
              const textInput =
                cleaned
                  .map(
                    (item) =>
                      item.name.trim(),
                  )
                  .filter(Boolean)
                  .join(', ')

              const initialResult =
                await analyzeNutritionText(
                  selectedDate,
                  MEAL_TYPE_BY_KEY[
                    key
                  ],
                  textInput,
                )

              const result =
                await waitForNutritionAnalysis(
                  initialResult,
                )

              const hasAnalyzedFoods =
                result.status !==
                  'FAILED' &&
                result.status !==
                  'CANCELLED' &&
                result.foods.length >
                  0

              if (
                !hasAnalyzedFoods
              ) {
                throw new Error(
                  'AI 영양성분 분석 결과가 없습니다.',
                )
              }

              // 핵심:
              // kcal는 사용자가 입력한 값을 유지하고,
              // 탄수화물/단백질/지방은 AI 분석값을 사용합니다.
              //
              // 텍스트 분석 결과는 draft이므로
              // record 전에 draft food를 한 번 PATCH해야
              // 사용자 kcal + AI 탄단지가 함께 저장됩니다.
              await Promise.all(
                result.foods.map(
                  (
                    food,
                    index,
                  ) => {
                    const userItem =
                      cleaned[
                        index
                      ] ??
                      cleaned[0]

                    return updateNutritionDraftFood(
                      result.analysisId,
                      food.draftFoodId,
                      {
                        foodName:
                          userItem.name.trim(),
                        kcal:
                          userItem.kcal ??
                          0,
                        carbs:
                          food.carbs,
                        protein:
                          food.protein,
                        fat:
                          food.fat,
                      },
                    )
                  },
                ),
              )

              await recordNutritionAnalysis(
                result.analysisId,
              )
            } catch (error) {
              console.error(
                '텍스트 영양 분석에 실패했습니다.',
                error,
              )

              // 분석이 실패해도 사용자가 입력한 음식과 kcal는
              // 기존 방식대로 저장해서 기존 기능을 보존합니다.
              // 이 경우 탄/단/지는 없을 수 있습니다.
              await saveMeal(
                selectedDate,
                key,
                {
                  items:
                    cleaned.map(
                      (item) => ({
                        mealId:
                          item.mealId,
                        name:
                          item.name.trim(),
                        kcal:
                          item.kcal ??
                          0,
                        carbs:
                          item.carbs,
                        protein:
                          item.protein,
                        fat:
                          item.fat,
                      }),
                    ),
                },
              )

              setAnalysisError(
                '식사는 저장했지만 영양성분 분석에 실패했어요.',
              )
            }
          }
        } else {
          await saveMeal(
            selectedDate,
            key,
            {
              items:
                cleaned.map(
                  (item) => ({
                    mealId:
                      item.mealId,
                    name:
                      item.name,
                    kcal:
                      item.kcal ?? 0,
                    carbs:
                      item.carbs,
                    protein:
                      item.protein,
                    fat:
                      item.fat,
                  }),
                ),
            },
          )
        }

        navigate(
          -1,
        )
      } catch (error) {
        console.error(
          '식사 기록 저장에 실패했습니다.',
          error,
        )
      } finally {
        setSaving(
          false,
        )

        setAnalyzing(
          false,
        )
      }
    }

  return (
    <div className="relative flex h-full flex-col bg-white">

      {/* 헤더 */}
      <header
        className="shrink-0 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                -1,
              )
            }
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-gray-900">
            식단 기록 입력하기
          </h1>
        </div>
      </header>

      {/* 탭 */}
      <div className="mx-6 mt-6 rounded-full bg-[#EAF8EC] p-1">
        <div className="flex">

          <button
            type="button"
            onClick={() =>
              setTab(
                'manual',
              )
            }
            className={
              'flex-1 rounded-full py-2 text-[12px] transition-colors ' +
              (
                tab ===
                  'manual'
                  ? 'bg-[#31C66B] font-semibold text-white'
                  : 'text-gray-500'
              )
            }
          >
            직접입력
          </button>

          <button
            type="button"
            onClick={() =>
              setTab(
                'ai',
              )
            }
            className={
              'flex-1 rounded-full py-2 text-[12px] transition-colors ' +
              (
                tab ===
                  'ai'
                  ? 'bg-[#31C66B] font-semibold text-white'
                  : 'text-gray-500'
              )
            }
          >
            AI 자동인식
          </button>

        </div>
      </div>

      {showCamera ? (
        <CameraScan
          onCapture={
            onCapture
          }
        />
      ) : (
        <>

          {/* 본문 */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6">

            {/* 사진 */}
            <div className="mb-6 flex flex-col items-center">

              <button
                type="button"
                onClick={() =>
                  setCameraOpen(
                    true,
                  )
                }
                aria-label="카메라 촬영"
              >
                {photo ? (
                  <img
                    src={
                      photo
                    }
                    alt="식사 사진"
                    className="h-[90px] w-[90px] rounded-[5px] object-cover"
                  />
                ) : (
                  <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[5px] bg-gray-200 text-gray-400">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={
                        1.5
                      }
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8"
                    >
                      <path d="M4 8.5h3l1.5-2h7L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />

                      <circle
                        cx="12"
                        cy="13"
                        r="3.2"
                      />
                    </svg>

                  </div>
                )}
              </button>

              <p className="mt-3 text-[10px] text-gray-400">
                오늘 먹은 식사의 이미지를 업로드 해주세요!
              </p>

              {/* 갤러리 */}
              <label
                aria-label="파일 선택"
                className="mt-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={
                    1.6
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                  />

                  <circle
                    cx="8.5"
                    cy="9.5"
                    r="1.5"
                  />

                  <path d="M21 16l-5-5-4 4-2-2-7 7" />
                </svg>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    onUpload
                  }
                />
              </label>

            </div>

            {analyzing && (
              <p className="mb-4 text-center text-[10px] text-gray-400">
                AI가 식사를 분석하고 있어요...
              </p>
            )}

            {analysisError && (
              <p className="mb-4 text-center text-[10px] text-red-500">
                {analysisError}
              </p>
            )}

            {/* 음식 목록 */}
            <div className="space-y-2">

              {items.map(
                (
                  item,
                  i,
                ) => (
                  <div
                    key={
                      item.mealId ??
                      i
                    }
                    className="rounded-[5px] bg-[#F8F8F8] px-4 py-3"
                  >

                    <div className="mb-1 flex items-center justify-between">

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-gray-400">
                          음식{' '}
                          {i + 1}
                        </span>

                        {item.source ===
                          'AI_ESTIMATE' && (
                            <span className="rounded bg-[#EAF8EC] px-1.5 py-0.5 text-[8px] font-medium text-[#31C66B]">
                              AI 추정
                            </span>
                          )}

                        {item.source ===
                          'USER_INPUT' && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-500">
                              직접 입력
                            </span>
                          )}

                        {(item.kcal === null ||
                          item.carbs === null ||
                          item.protein === null ||
                          item.fat === null) && (
                            <span className="text-[8px] text-amber-500">
                              영양정보 일부 미확인
                            </span>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          remove(
                            i,
                          )
                        }
                        aria-label="삭제"
                        className="text-[12px] text-gray-400"
                      >
                        ×
                      </button>

                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          value={item.name}
                          onChange={(e) =>
                            setName(
                              i,
                              e.target.value,
                            )
                          }
                          placeholder="음식 이름"
                          className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-gray-900 outline-none placeholder:text-gray-300"
                        />

                        <input
                          value={
                            item.kcal ??
                            ''
                          }
                          onChange={(e) =>
                            setKcal(
                              i,
                              e.target.value.replace(
                                /\D/g,
                                '',
                              ),
                            )
                          }
                          inputMode="numeric"
                          placeholder="0"
                          className="w-12 bg-transparent text-right text-[13px] font-bold text-[#31C66B] outline-none"
                        />

                        <span className="text-[11px] font-medium text-[#31C66B]">
                          kcal
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[9px] text-gray-500">
                        <span>
                          탄수화물{' '}
                          <strong className="font-semibold text-gray-700">
                            {item.carbs !== null &&
                            item.carbs !== undefined
                              ? `${item.carbs}g`
                              : '-'}
                          </strong>
                        </span>

                        <span>
                          단백질{' '}
                          <strong className="font-semibold text-gray-700">
                            {item.protein !== null &&
                            item.protein !== undefined
                              ? `${item.protein}g`
                              : '-'}
                          </strong>
                        </span>

                        <span>
                          지방{' '}
                          <strong className="font-semibold text-gray-700">
                            {item.fat !== null &&
                            item.fat !== undefined
                              ? `${item.fat}g`
                              : '-'}
                          </strong>
                        </span>
                      </div>
                    </div>

                  </div>
                ),
              )}

              {/* 음식 추가 */}
              <button
                type="button"
                onClick={
                  add
                }
                className="
                  flex h-14 w-full
                  items-center justify-center
                  rounded-lg
                  border border-[#31C66B]
                  bg-[#F1FFF6]
                  text-2xl font-light
                  text-gray-400
                "
              >
                +
              </button>

            </div>

          </div>

          {/* 예상 섭취 열량 + 저장 */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-6 pb-5 pt-4">

            <div className="mb-3 flex items-end justify-between">

              <span className="text-[11px] font-medium text-gray-700">
                예상 섭취 열량
              </span>

              <span className="text-[22px] font-bold text-[#31C66B]">
                {total}

                <span className="ml-1 text-[11px] font-medium">
                  kcal
                </span>
              </span>

            </div>

            <button
              type="button"
              onClick={
                save
              }
              disabled={
                saving ||
                analyzing
              }
              className={
                'w-full rounded-full py-3 text-[16px] font-bold transition-colors ' +
                (
                  saving ||
                    analyzing
                    ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                    : 'bg-[#31C66B] text-white active:bg-[#29B760]'
                )
              }
            >
              {analyzing
                ? '분석 중...'
                : saving
                  ? '저장 중...'
                  : '저장하기'}
            </button>

          </div>

        </>
      )}

      {/* 직접입력 카메라 오버레이 */}
      {cameraOpen && (
        <div className="absolute inset-0 z-30 flex flex-col bg-black">

          <CameraScan
            onCapture={
              onCaptureDirect
            }
            onClose={() =>
              setCameraOpen(
                false,
              )
            }
          />

        </div>
      )}
    </div>
  )
}