// 관심 상품 / 관심 시술 (스토어에서 하트로 찜한 항목). 백엔드 없이 브라우저에만 저장한다.
const PRODUCT_KEY = 'bloom.favoriteProducts'
const PROCEDURE_KEY = 'bloom.favoriteProcedures'

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)

    if (!raw) return []

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === 'string')
      : []
  } catch {
    return []
  }
}

function writeList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list))
}

function toggle(key: string, name: string): string[] {
  const list = readList(key)

  const next = list.includes(name)
    ? list.filter((item) => item !== name)
    : [...list, name]

  writeList(key, next)

  return next
}

export function getFavoriteProducts() {
  return readList(PRODUCT_KEY)
}

export function getFavoriteProcedures() {
  return readList(PROCEDURE_KEY)
}

export function toggleFavoriteProduct(name: string) {
  return toggle(PRODUCT_KEY, name)
}

export function toggleFavoriteProcedure(name: string) {
  return toggle(PROCEDURE_KEY, name)
}
