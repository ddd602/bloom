import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconChevronLeft } from '../components/icons'

// 데모 데이터
const CHIPS = [
  '다이어트 보조제',
  '멀티비타민',
  '피부 케어',
  '다이어트 도시락',
]

const ITEMS = [
  {
    name: '튼살 제거 시술',
    price: '~220,000',
    desc1: '소요 횟수: 5회~10회 이상 반복 치료 필요',
    desc2: '간격: 보통 3~4주 간격 진행',
  },
  {
    name: '튼살 제거 시술',
    price: '~220,000',
    desc1: '소요 횟수: 5회~10회 이상 반복 치료 필요',
    desc2: '간격: 보통 3~4주 간격 진행',
  },
]

const RANKING = [
  {
    rank: 1,
    company: '영양제 회사',
    name: '영양제 이름',
  },
  {
    rank: 2,
    company: '영양제 회사',
    name: '영양제 이름',
  },
  {
    rank: 3,
    company: '영양제 회사',
    name: '영양제 이름',
  },
]

// 카테고리
function ChipRow() {
  const [sel, setSel] = useState(0)

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {CHIPS.map((c, i) => (
        <button
          key={c}
          type="button"
          onClick={() => setSel(i)}
          className={
            'rounded-full px-2.5 py-1 text-[9px] transition-colors ' +
            (sel === i
              ? 'bg-[#31C66B] font-semibold text-white'
              : 'bg-[#EAF8EC] text-[#31B76A]')
          }
        >
          {c}
        </button>
      ))}
    </div>
  )
}

// 제품 / 시술 카드
function ItemCard({
  item,
}: {
  item: (typeof ITEMS)[number]
}) {
  return (
    <div className="flex min-h-[78px] bg-white">
      {/* 이미지 자리 */}
      <div className="w-[82px] shrink-0 bg-gray-300" />

      {/* 정보 */}
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
    </div>
  )
}

// 섹션 제목
function SectionHeader({
  title,
  sub,
  to,
}: {
  title: string
  sub: string
  to: string
}) {
  return (
    <div className="mb-3">
      <Link
        to={to}
        className="flex items-center justify-between"
      >
        <h2 className="text-[13px] font-bold text-gray-900">
          {title}
        </h2>

        <span className="text-[22px] font-light leading-none text-gray-400">
          ›
        </span>
      </Link>

      <p className="mt-1 text-[8px] text-gray-400">
        {sub}
      </p>
    </div>
  )
}

export default function StoreScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-white">

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
            onClick={() => navigate(-1)}
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

      {/* 본문 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">

        {/* 맞춤 제품 추천 */}
        <section>
          <SectionHeader
            title="맞춤 제품 추천"
            sub="미용 목표를 달성할 수 있게 도와주는 제품을 추천해드려요"
            to="/my-page/store/products"
          />

          <ChipRow />

          <div className="space-y-2">
            {ITEMS.map((it, i) => (
              <ItemCard
                key={i}
                item={it}
              />
            ))}
          </div>
        </section>

        {/* 맞춤 시술 추천 */}
        <section className="mt-7">
          <SectionHeader
            title="맞춤 시술 추천"
            sub="미용 목표를 달성할 수 있게 도와주는 시술을 추천해드려요"
            to="/my-page/store/procedures"
          />

          <ChipRow />

          <div className="space-y-2">
            {ITEMS.map((it, i) => (
              <ItemCard
                key={i}
                item={it}
              />
            ))}
          </div>
        </section>

        {/* 실시간 랭킹 */}
        <section className="mt-7">
          <SectionHeader
            title="실시간 랭킹"
            sub="요즘 많이 찾는 제품 순위"
            to="/my-page/store/ranking"
          />

          <div className="flex gap-3 overflow-x-auto pb-2">
            {RANKING.map((r) => (
              <div
                key={r.rank}
                className="w-[105px] shrink-0"
              >
                {/* 상품 이미지 */}
                <div className="relative h-[105px] w-[105px] rounded-sm bg-gray-300">
                  <span
                    className="
                      absolute left-1.5 top-1.5
                      flex h-4 w-4
                      items-center justify-center
                      rounded-sm
                      bg-[#31C66B]
                      text-[8px] font-bold text-white
                    "
                  >
                    {r.rank}
                  </span>
                </div>

                <p className="mt-2 text-[8px] text-gray-400">
                  {r.company}
                </p>

                <p className="mt-0.5 text-[10px] font-semibold text-gray-900">
                  {r.name}
                </p>

                <p className="mt-1 text-[10px]">
                  <span className="font-bold text-[#31C66B]">
                    30%
                  </span>{' '}
                  <span className="font-bold text-gray-900">
                    32,000
                  </span>
                </p>

                <span
                  className="
                    mt-1 inline-block
                    rounded-full
                    bg-[#EAF8EC]
                    px-2 py-0.5
                    text-[7px]
                    text-[#31B76A]
                  "
                >
                  다이어트 보조제
                </span>

                <p className="mt-1 text-[8px] text-gray-400">
                  ★ 4.9 (4,232)
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}