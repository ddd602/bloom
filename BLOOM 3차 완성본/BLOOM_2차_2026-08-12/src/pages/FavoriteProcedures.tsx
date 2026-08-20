import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader'
import { PROCEDURES, ItemCard } from './StoreScreen'

import {
  getFavoriteProcedures,
  toggleFavoriteProcedure,
} from '../utils/favorites'

export default function FavoriteProcedures() {
  const [favorites, setFavorites] =
    useState<string[]>(getFavoriteProcedures)

  const items = PROCEDURES.filter((item) =>
    favorites.includes(item.name),
  )

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="관심 시술" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-5">
        {items.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <p className="text-[11px] text-gray-400">
              아직 찜한 시술이 없어요
            </p>

            <p className="mt-1 text-[9px] text-gray-400">
              스토어에서 하트를 눌러 관심 시술을 담아보세요
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                favorite
                onToggleFavorite={() =>
                  setFavorites(
                    toggleFavoriteProcedure(item.name),
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
