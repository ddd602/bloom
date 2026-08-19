import {
  useEffect,
  useState,
} from 'react'

import ScreenHeader from '../../components/ScreenHeader'

import {
  deleteNudeBodyPhoto,
  getNudeBodyPhotos,
  type NudeBodyPhoto,
} from '../../components/api/NudeBodyApi'

import {
  getPrivateImageUrl,
} from '../../components/api/ImageUploadApi'

type DisplayPhoto = {
  photo: NudeBodyPhoto
  imageUrl: string
}

function formatWeek(
  dateKey: string,
) {
  const date =
    new Date(
      `${dateKey}T00:00:00`,
    )

  const month =
    date.getMonth() + 1

  const week =
    Math.ceil(
      date.getDate() / 7,
    )

  return `${month}월 ${week}주차`
}

function NudeBodyGalleryPage() {
  const [
    photos,
    setPhotos,
  ] =
    useState<
      DisplayPhoto[]
    >([])

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      string | null
    >(null)

  useEffect(() => {
    let cancelled = false

    const objectUrls:
      string[] = []

    const loadPhotos =
      async () => {
        try {
          const data =
            await getNudeBodyPhotos()

          const sorted =
            [...data].sort(
              (a, b) =>
                new Date(
                  b.createdAt,
                ).getTime() -
                new Date(
                  a.createdAt,
                ).getTime(),
            )

          const displayPhotos =
            await Promise.all(
              sorted.map(
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
      cancelled = true

      objectUrls.forEach(
        (url) => {
          URL.revokeObjectURL(
            url,
          )
        },
      )
    }
  }, [])

  const handleDelete =
    async (
      id: string,
    ) => {
      if (
        deletingId !== null
      ) {
        return
      }

      const confirmed =
        window.confirm(
          '이 눈바디 기록을 삭제할까요?',
        )

      if (!confirmed) {
        return
      }

      try {
        setDeletingId(id)

        await deleteNudeBodyPhoto(
          id,
        )

        setPhotos(
          (prev) => {
            const target =
              prev.find(
                ({
                  photo,
                }) =>
                  photo.id ===
                  id,
              )

            if (
              target?.imageUrl.startsWith(
                'blob:',
              )
            ) {
              URL.revokeObjectURL(
                target.imageUrl,
              )
            }

            return prev.filter(
              ({
                photo,
              }) =>
                photo.id !==
                id,
            )
          },
        )
      } catch (error) {
        console.error(
          '눈바디 사진을 삭제하지 못했습니다.',
          error,
        )

        window.alert(
          '눈바디 사진 삭제에 실패했어요.',
        )
      } finally {
        setDeletingId(
          null,
        )
      }
    }

  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader title="눈바디 갤러리" />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-7">
        <h2 className="text-[14px] font-bold text-gray-900">
          눈바디 변화 갤러리
        </h2>

        <p className="mt-1 text-[9px] leading-[13px] text-gray-400">
          매주 기록한 눈바디 변화를 한눈에 확인해보세요
        </p>

        {photos.length ===
        0 ? (
          <div className="mt-5 flex h-[150px] items-center justify-center rounded-xl bg-[#F7F7F7] text-[10px] text-gray-400">
            아직 서버에 저장된 눈바디 사진이 없어요
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-4">
            {photos.map(
              ({
                photo,
                imageUrl,
              }) => (
                <div
                  key={
                    photo.id
                  }
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#D9D9D9]">
                    <img
                      src={
                        imageUrl
                      }
                      alt="눈바디 기록"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-2 text-center text-[9px] font-medium text-gray-600">
                    {formatWeek(
                      photo.date,
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(
                        photo.id,
                      )
                    }
                    disabled={
                      deletingId ===
                      photo.id
                    }
                    className={
                      'mt-1 w-full text-center text-[8px] ' +
                      (
                        deletingId ===
                        photo.id
                          ? 'text-gray-300'
                          : 'text-red-400'
                      )
                    }
                  >
                    {deletingId ===
                    photo.id
                      ? '삭제 중...'
                      : '삭제'}
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NudeBodyGalleryPage