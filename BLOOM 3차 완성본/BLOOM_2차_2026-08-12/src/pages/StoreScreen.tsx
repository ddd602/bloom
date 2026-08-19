import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft } from '../components/icons'

// WIM Store 실제 카테고리
const PRODUCT_CHIPS = [
  '쉐이크',
  '도시락',
  '식이섬유',
  '세트상품',
]

// WIM Store 실제 상품
const PRODUCTS = [
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

// WIM Clinic 카테고리
const PROCEDURE_CHIPS = [
  '비만대사 진료',
  'GLP-1/GIP',
  'Post-GLP-1',
  '바디 컨투어링',
]

// WIM Clinic 실제 프로그램
const PROCEDURES = [
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

function ItemCard({
  item,
}: {
  item: (typeof PRODUCTS)[number]
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[78px] bg-white active:bg-gray-50"
    >
      <div className="w-[82px] shrink-0 bg-gray-300" />

      <div className="min-w-0 flex-1 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold text-gray-900">
            {item.name}
          </p>

          <p className="shrink-0 text-[10px] font-medium text-[#31C66B]">
            {item.price}
          </p>
        </div>

        <p className="mt-2 text-[8px] leading-4 text-gray-400">
          {item.desc1}
        </p>

        <p className="text-[8px] leading-4 text-gray-400">
          {item.desc2}
        </p>
      </div>
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

  const selectProductChip = (
    chip: string,
  ) => {
    setProductChip(chip)

    sessionStorage.setItem(
      PRODUCT_CHIP_KEY,
      chip,
    )
  }

  const selectProcedureChip = (
    chip: string,
  ) => {
    setProcedureChip(chip)

    sessionStorage.setItem(
      PROCEDURE_CHIP_KEY,
      chip,
    )
  }

  const filteredProducts =
    PRODUCTS.filter(
      (item) =>
        item.category ===
        productChip,
    )

  const filteredProcedures =
    PROCEDURES.filter(
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
            sub="WIM Store에서 미용 목표에 맞는 제품을 추천해드려요"
            href="https://wimstore.co.kr"
          />

          <ChipRow
            chips={
              PRODUCT_CHIPS
            }
            selected={
              productChip
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
                />
              ),
            )}
          </div>
        </section>

        <section className="mt-7">
          <SectionHeader
            title="맞춤 시술 추천"
            sub="WIM Clinic에서 미용 목표에 맞는 시술을 추천해드려요"
            href="https://wimclinic.com"
          />

          <ChipRow
            chips={
              PROCEDURE_CHIPS
            }
            selected={
              procedureChip
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
                />
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}