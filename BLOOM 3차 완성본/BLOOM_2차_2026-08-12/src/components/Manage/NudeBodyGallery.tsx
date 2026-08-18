import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getNudeBodyPhotos,
  type NudeBodyPhoto,
} from '../api/NudeBodyApi'

import {
  getPrivateImageUrl,
} from '../api/ImageUploadApi'

import { IconChevronRight } from '../icons'

type DisplayPhoto = {
  photo: NudeBodyPhoto
  imageUrl: string
}

function formatWeek(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`)
  const month = date.getMonth() + 1
  const week = Math.ceil(date.getDate() / 7)

  return `${month}월 ${week}주차`
}

function NudeBodyGallery({ to }: { to: string }) {
  const [
    photos,
    setPhotos,
  ] =
    useState<DisplayPhoto[]>([])

  useEffect(() => {
    let cancelled = false

    const objectUrls: string[] = []

    const loadPhotos =
      async () => {
        try {
          const data =
            await getNudeBodyPhotos()

          const recent =
            [...data]
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt,
                  ).getTime() -
                  new Date(
                    a.createdAt,
                  ).getTime(),
              )
              .slice(
                0,
                4,
              )

          const displayPhotos =
            await Promise.all(
              recent.map(
                async (
                  photo,
                ) => {
                  const imageUrl =
                    await getPrivateImageUrl(
                      photo.image,
                    )

                  if (
                    imageUrl.startsWith(
                      'blob:',
                    )
                  ) {
                    objectUrls.push(
                      imageUrl,
                    )
                  }

                  return {
                    photo,
                    imageUrl,
                  }
                },
              ),
            )

          if (
            !cancelled
          ) {
            setPhotos(
              displayPhotos,
            )
          }
        } catch (error) {
          console.error(
            '눈바디 갤러리를 불러오지 못했습니다.',
            error,
          )
        }
      }

    void loadPhotos()

    return () => {
      cancelled =
        true

      objectUrls.forEach(
        (url) => {
          URL.revokeObjectURL(
            url,
          )
        },
      )
    }
  }, [])

  return (
    <section>
      <Link
        to={to}
        className="flex items-center justify-between"
      >
        <h2 className="text-[14px] font-bold text-gray-900">
          눈바디 변화 갤러리
        </h2>

        <IconChevronRight className="h-6 w-6 text-gray-400" />
      </Link>

      <p className="mt-1 text-[8px] leading-[12px] text-gray-400">
        지난 4주간의 눈바디 변화를 확인할 수 있어요
      </p>

      {photos.length ===
      0 ? (
        <div className="mt-4 flex h-[90px] items-center justify-center rounded-lg bg-[#F7F7F7] text-[9px] text-gray-400">
          아직 눈바디 기록이 없어요
        </div>
      ) : (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {photos.map(
            ({
              photo,
              imageUrl,
            }) => (
              <div
                key={
                  photo.id
                }
                className="w-[82px] shrink-0"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-300">
                  <img
                    src={
                      imageUrl
                    }
                    alt="눈바디 기록"
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="mt-1.5 text-center text-[8px] text-gray-500">
                  {formatWeek(
                    photo.date,
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  )
}

export default NudeBodyGallery