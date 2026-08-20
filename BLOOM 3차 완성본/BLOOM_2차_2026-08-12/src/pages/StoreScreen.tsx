import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconHeart } from '../components/icons'

import { getProfile } from '../components/api/ProfileApi'
import { pickGoalVariant, type GoalId } from '../utils/characterVariant'

import {
  getFavoriteProducts,
  getFavoriteProcedures,
  toggleFavoriteProduct,
  toggleFavoriteProcedure,
} from '../utils/favorites'

// WIM Store 실제 카테고리
const PRODUCT_CHIPS = [
  '쉐이크',
  '도시락',
  '식이섬유',
  '세트상품',
]

// WIM Store 실제 상품
export const PRODUCTS = [
  {
    category: '쉐이크',
    name: '저당·저탄수·고단백 윔쉐이크 초코 800g',
    price: '56,000원',
    desc1: '내과전문의가 설계한 식단 쉐이크',
    desc2: '저당 · 저탄수 · 고단백',
    href: 'https://wimstore.co.kr/category/%EC%89%90%EC%9D%B4%ED%81%AC/26/',
  },
  {
    category: '쉐이크',
    name: '저당·저탄수·고단백 윔쉐이크 검은콩 800g',
    price: '56,000원',
    desc1: '내과전문의가 설계한 식단 쉐이크',
    desc2: '저당 · 저탄수 · 고단백',
    href: 'https://wimstore.co.kr/category/%EC%89%90%EC%9D%B4%ED%81%AC/26/',
  },
  {
    category: '쉐이크',
    name: '저당·저탄수·고단백 윔쉐이크 말차 420g',
    price: '36,000원',
    desc1: '내과전문의가 설계한 식단 쉐이크',
    desc2: '저당 · 저탄수 · 고단백',
    href: 'https://wimstore.co.kr/category/%EC%89%90%EC%9D%B4%ED%81%AC/26/',
  },
  {
    category: '도시락',
    name: '윔도시락 - 소불고기 곤드레밥 외 6종',
    price: '10,900원',
    desc1: '내과전문의가 설계한 건강 도시락',
    desc2: '단백질 위주 균형 식단',
    href: 'https://wimstore.co.kr/category/%EB%8F%84%EC%8B%9C%EB%9D%BD/25/',
  },
  {
    category: '도시락',
    name: '윔다이어트 3일 식단 감량 패키지',
    price: '58,100원',
    desc1: '냉동 택배배송 도시락 패키지',
    desc2: '3일 완성 식단 패키지',
    href: 'https://wimstore.co.kr/category/%EB%8F%84%EC%8B%9C%EB%9D%BD/25/',
  },
  {
    category: '도시락',
    name: '윔다이어트 5일 식단 감량 패키지',
    price: '71,000원',
    desc1: '냉동 택배배송 도시락 패키지',
    desc2: '5일 완성 식단 패키지',
    href: 'https://wimstore.co.kr/category/%EB%8F%84%EC%8B%9C%EB%9D%BD/25/',
  },
  {
    category: '식이섬유',
    name: '마시는 식이섬유 비포밀 (30포)',
    price: '34,000원',
    desc1: '식사 전 섭취하는 식이섬유 보조제',
    desc2: '내과전문의 설계',
    href: 'https://wimstore.co.kr/category/%EC%8B%9D%EC%9D%B4%EC%84%AC%EC%9C%A0/52/',
  },
  {
    category: '식이섬유',
    name: '마시는 식이섬유 비포밀 스위치 (30포)',
    price: '36,000원',
    desc1: '식사 전 섭취하는 식이섬유 보조제',
    desc2: '내과전문의 설계',
    href: 'https://wimstore.co.kr/category/%EC%8B%9D%EC%9D%B4%EC%84%AC%EC%9C%A0/52/',
  },
  {
    category: '식이섬유',
    name: '비포밀 + 비포밀 스위치 (각 1BOX)',
    price: '70,000원',
    desc1: '식사 전 섭취하는 식이섬유 보조제',
    desc2: '내과전문의 설계',
    href: 'https://wimstore.co.kr/category/%EC%8B%9D%EC%9D%B4%EC%84%AC%EC%9C%A0/52/',
  },
  {
    category: '세트상품',
    name: '지질 DOWN 패키지 (대용량 + 비포밀)',
    price: '88,900원',
    desc1: '쉐이크 · 식이섬유 구성 세트',
    desc2: '체지방 관리 집중 패키지',
    href: 'https://wimstore.co.kr/category/%EC%84%B8%ED%8A%B8%EC%83%81%ED%92%88/60/',
  },
  {
    category: '세트상품',
    name: '지질 DOWN 스타터 패키지 (파우치 + 비포밀)',
    price: '51,000원',
    desc1: '쉐이크 · 식이섬유 구성 세트',
    desc2: '체지방 관리 입문 패키지',
    href: 'https://wimstore.co.kr/category/%EC%84%B8%ED%8A%B8%EC%83%81%ED%92%88/60/',
  },
  {
    category: '세트상품',
    name: '윔다이어트 5일 식단 패키지',
    price: '71,000원',
    desc1: '쉐이크 · 도시락 구성 세트',
    desc2: '5일 완성 식단 패키지',
    href: 'https://wimstore.co.kr/category/%EC%84%B8%ED%8A%B8%EC%83%81%ED%92%88/60/',
  },
]

// 미용목표별 개별 상품 추천 (카테고리가 아니라 실제 상품 단위로 추천)
const GOAL_TO_PRODUCT_ITEMS: Record<GoalId, string[]> = {
  weight: [
    '저당·저탄수·고단백 윔쉐이크 초코 800g',
    '윔다이어트 5일 식단 감량 패키지',
  ],
  line: [
    '지질 DOWN 패키지 (대용량 + 비포밀)',
    '지질 DOWN 스타터 패키지 (파우치 + 비포밀)',
  ],
  health: [
    '윔도시락 - 소불고기 곤드레밥 외 6종',
    '마시는 식이섬유 비포밀 (30포)',
  ],
  skin: [
    '마시는 식이섬유 비포밀 스위치 (30포)',
    '저당·저탄수·고단백 윔쉐이크 말차 420g',
  ],
}

// WIM Clinic 카테고리
const PROCEDURE_CHIPS = [
  '비만대사 진료',
  'GLP-1/GIP',
  'Post-GLP-1',
  '바디 컨투어링',
]

// WIM Clinic 실제 프로그램
export const PROCEDURES = [
  {
    category: '비만대사 진료',
    name: '비만대사 원인 진단 상담',
    price: '상담 후 결정',
    desc1: '대사 원인 분석 및 체중감량 상담',
    desc2: '내과 전문의 진료',
    href: 'https://wimclinic.com',
  },
  {
    category: 'GLP-1/GIP',
    name: '위고비(Wegovy) 정밀 관리',
    price: '상담 후 결정',
    desc1: 'GLP-1 기반 약물 치료 관리',
    desc2: '부작용 모니터링 포함',
    href: 'https://wimclinic.com',
  },
  {
    category: 'GLP-1/GIP',
    name: '마운자로(Mounjaro) 정밀 관리',
    price: '상담 후 결정',
    desc1: 'GIP · GLP-1 이중작용제 치료 관리',
    desc2: '부작용 모니터링 포함',
    href: 'https://wimclinic.com',
  },
  {
    category: 'Post-GLP-1',
    name: '처짐 개선 탄력 케어',
    price: '상담 후 결정',
    desc1: '체중 감량 후 피부 처짐 · 탄력 회복',
    desc2: '볼륨 재배치 · 라인 정리',
    href: 'https://wimclinic.com',
  },
  {
    category: 'Post-GLP-1',
    name: '체성분 정밀 분석',
    price: '상담 후 결정',
    desc1: 'DEXA · 3D 바디스캔 · 초음파 검사',
    desc2: '체성분 변화 종합 분석',
    href: 'https://wimclinic.com',
  },
  {
    category: '바디 컨투어링',
    name: '부위별 지방 감소',
    price: '상담 후 결정',
    desc1: '복부 · 팔뚝 · 허벅지 · 옆구리',
    desc2: '피하지방 · 부분비만 집중 관리',
    href: 'https://wimclinic.com',
  },
  {
    category: '바디 컨투어링',
    name: '체형 밸런스 교정',
    price: '상담 후 결정',
    desc1: '자세 및 골반 밸런스 교정',
    desc2: '좌우 대칭 · 코어 강화',
    href: 'https://wimclinic.com',
  },
  {
    category: '바디 컨투어링',
    name: '탄력 & 라인 케어',
    price: '상담 후 결정',
    desc1: '볼륨 증대 · 피부 탄력 개선',
    desc2: '주름 · 처짐 케어',
    href: 'https://wimclinic.com',
  },
]

// 미용목표별 개별 시술 추천 (카테고리가 아니라 실제 시술 단위로 추천)
const GOAL_TO_PROCEDURE_ITEMS: Record<GoalId, string[]> = {
  weight: [
    '위고비(Wegovy) 정밀 관리',
    '마운자로(Mounjaro) 정밀 관리',
  ],
  line: [
    '체형 밸런스 교정',
    '탄력 & 라인 케어',
  ],
  health: [
    '비만대사 원인 진단 상담',
    '체성분 정밀 분석',
  ],
  skin: [
    '처짐 개선 탄력 케어',
    '탄력 & 라인 케어',
  ],
}

function ChipRow({
  chips,
  selected,
  onSelect,
}: {
  chips: string[]
  selected: string
  onSelect: (chip: string) => void
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className={
            'rounded-full px-2.5 py-1 text-[9px] transition-colors ' +
            (selected === chip
              ? 'bg-[#31C66B] font-semibold text-white'
              : 'bg-[#EAF8EC] text-[#31B76A]')
          }
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

export function ItemCard({
  item,
  favorite,
  onToggleFavorite,
}: {
  item: (typeof PRODUCTS)[number]
  favorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex min-h-[78px] bg-white active:bg-gray-50"
    >
      <div className="w-[82px] shrink-0 bg-gray-300" />

      <div className="min-w-0 flex-1 px-4 py-3">
        <p className="pr-6 text-[11px] font-bold text-gray-900">
          {item.name}
        </p>

        <p className="mt-2 text-[8px] leading-4 text-gray-400">
          {item.desc1}
        </p>

        <p className="text-[8px] leading-4 text-gray-400">
          {item.desc2}
        </p>

        <p className="mt-2 text-right text-[10px] font-medium text-[#31C66B]">
          {item.price}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleFavorite()
        }}
        aria-label={
          favorite
            ? '관심 목록에서 제거'
            : '관심 목록에 추가'
        }
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center"
      >
        <IconHeart
          filled={favorite}
          className={
            'h-4 w-4 ' +
            (favorite
              ? 'text-[#E86B5C]'
              : 'text-gray-300')
          }
        />
      </button>
    </a>
  )
}

function SectionHeader({
  title,
  sub,
  to,
  href,
}: {
  title: string
  sub: string
  to?: string
  href?: string
}) {
  const content = (
    <>
      <h2 className="text-[13px] font-bold text-gray-900">
        {title}
      </h2>

      <span className="text-[22px] font-light leading-none text-gray-400">
        ›
      </span>
    </>
  )

  return (
    <div className="mb-3">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between"
        >
          {content}
        </a>
      ) : (
        <Link
          to={to ?? '#'}
          className="flex items-center justify-between"
        >
          {content}
        </Link>
      )}

      <p className="mt-1 text-[8px] text-gray-400">
        {sub}
      </p>
    </div>
  )
}

const PRODUCT_CHIP_KEY =
  'store.productChip'

const PROCEDURE_CHIP_KEY =
  'store.procedureChip'

export default function StoreScreen() {
  const navigate = useNavigate()

  const [
    productChip,
    setProductChip,
  ] = useState(
    () =>
      sessionStorage.getItem(
        PRODUCT_CHIP_KEY,
      ) ??
      PRODUCT_CHIPS[0],
  )

  const [
    procedureChip,
    setProcedureChip,
  ] = useState(
    () =>
      sessionStorage.getItem(
        PROCEDURE_CHIP_KEY,
      ) ??
      PROCEDURE_CHIPS[0],
  )

  // 사용자가 칩을 직접 고른 적 있는지 (있으면 개별 추천 대신 카테고리 탐색으로 전환)
  const [
    manualProductChoice,
    setManualProductChoice,
  ] = useState(
    () =>
      sessionStorage.getItem(
        PRODUCT_CHIP_KEY,
      ) !== null,
  )

  const [
    manualProcedureChoice,
    setManualProcedureChoice,
  ] = useState(
    () =>
      sessionStorage.getItem(
        PROCEDURE_CHIP_KEY,
      ) !== null,
  )

  // 관심 상품 / 관심 시술 (하트로 찜한 항목 이름 목록)
  const [
    favoriteProducts,
    setFavoriteProducts,
  ] = useState<string[]>(
    getFavoriteProducts,
  )

  const [
    favoriteProcedures,
    setFavoriteProcedures,
  ] = useState<string[]>(
    getFavoriteProcedures,
  )

  const handleToggleFavoriteProduct = (
    name: string,
  ) => {
    setFavoriteProducts(
      toggleFavoriteProduct(name),
    )
  }

  const handleToggleFavoriteProcedure = (
    name: string,
  ) => {
    setFavoriteProcedures(
      toggleFavoriteProcedure(name),
    )
  }

  // 미용목표에 맞춰 개별로 추천된 상품/시술 이름 목록
  const [
    goalProductNames,
    setGoalProductNames,
  ] = useState<string[]>([])

  const [
    goalProcedureNames,
    setGoalProcedureNames,
  ] = useState<string[]>([])

  const selectProductChip = (
    chip: string,
  ) => {
    // 이미 선택된 칩을 다시 누르면 선택을 해제하고
    // 미용목표 기반 추천으로 되돌아감
    if (
      !showProductRecommendation &&
      productChip === chip
    ) {
      setManualProductChoice(
        false,
      )

      sessionStorage.removeItem(
        PRODUCT_CHIP_KEY,
      )

      return
    }

    setProductChip(chip)
    setManualProductChoice(true)

    sessionStorage.setItem(
      PRODUCT_CHIP_KEY,
      chip,
    )
  }

  const selectProcedureChip = (
    chip: string,
  ) => {
    // 이미 선택된 칩을 다시 누르면 선택을 해제하고
    // 미용목표 기반 추천으로 되돌아감
    if (
      !showProcedureRecommendation &&
      procedureChip === chip
    ) {
      setManualProcedureChoice(
        false,
      )

      sessionStorage.removeItem(
        PROCEDURE_CHIP_KEY,
      )

      return
    }

    setProcedureChip(chip)
    setManualProcedureChoice(true)

    sessionStorage.setItem(
      PROCEDURE_CHIP_KEY,
      chip,
    )
  }

  // 사용자가 직접 고른 적 없으면(세션 저장값 없음),
  // 온보딩 미용목표에 맞는 상품/시술을 개별로 추천해줌
  useEffect(() => {
    const hasProductChoice =
      sessionStorage.getItem(
        PRODUCT_CHIP_KEY,
      ) !== null

    const hasProcedureChoice =
      sessionStorage.getItem(
        PROCEDURE_CHIP_KEY,
      ) !== null

    if (
      hasProductChoice &&
      hasProcedureChoice
    ) {
      return
    }

    getProfile()
      .then((profile) => {
        if (
          !profile.beautyGoals
            ?.length
        ) {
          return
        }

        const goal =
          pickGoalVariant(
            profile.beautyGoals,
          )

        if (!hasProductChoice) {
          setGoalProductNames(
            GOAL_TO_PRODUCT_ITEMS[
              goal
            ],
          )
        }

        if (!hasProcedureChoice) {
          setGoalProcedureNames(
            GOAL_TO_PROCEDURE_ITEMS[
              goal
            ],
          )
        }
      })
      .catch((error) => {
        console.error(
          '미용목표 기반 추천을 불러오지 못했습니다.',
          error,
        )
      })
  }, [])

  const showProductRecommendation =
    !manualProductChoice &&
    goalProductNames.length > 0

  const showProcedureRecommendation =
    !manualProcedureChoice &&
    goalProcedureNames.length > 0

  const filteredProducts =
    showProductRecommendation
      ? PRODUCTS.filter((item) =>
          goalProductNames.includes(
            item.name,
          ),
        )
      : PRODUCTS.filter(
          (item) =>
            item.category ===
            productChip,
        )

  const filteredProcedures =
    showProcedureRecommendation
      ? PROCEDURES.filter((item) =>
          goalProcedureNames.includes(
            item.name,
          ),
        )
      : PROCEDURES.filter(
          (item) =>
            item.category ===
            procedureChip,
        )

  return (
    <div className="flex h-full flex-col bg-white">
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
              navigate(-1)
            }
            aria-label="뒤로가기"
            className="flex h-6 w-6 items-center justify-center text-gray-500"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-gray-900">
            스토어 및 시술예약
          </h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">
        <section>
          <SectionHeader
            title="맞춤 제품 추천"
            sub="BLOOM은 상품을 직접 판매하지 않으며, 상품 선택 시 외부 스토어(WIM Store)로 이동해요"
            href="https://wimstore.co.kr"
          />

          <ChipRow
            chips={
              PRODUCT_CHIPS
            }
            selected={
              showProductRecommendation
                ? ''
                : productChip
            }
            onSelect={
              selectProductChip
            }
          />

          <div className="space-y-2">
            {filteredProducts.map(
              (item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  favorite={favoriteProducts.includes(
                    item.name,
                  )}
                  onToggleFavorite={() =>
                    handleToggleFavoriteProduct(
                      item.name,
                    )
                  }
                />
              ),
            )}
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader
            title="맞춤 시술 추천"
            sub="BLOOM은 시술을 직접 제공하지 않으며, 시술 선택 시 외부 사이트(WIM Clinic)로 이동해요"
            href="https://wimclinic.com"
          />

          <ChipRow
            chips={
              PROCEDURE_CHIPS
            }
            selected={
              showProcedureRecommendation
                ? ''
                : procedureChip
            }
            onSelect={
              selectProcedureChip
            }
          />

          <div className="space-y-2">
            {filteredProcedures.map(
              (item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  favorite={favoriteProcedures.includes(
                    item.name,
                  )}
                  onToggleFavorite={() =>
                    handleToggleFavoriteProcedure(
                      item.name,
                    )
                  }
                />
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}