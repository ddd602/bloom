import { useEffect, useRef, useState } from 'react'
import { IconChevronLeft } from '../icons'

type Props = {
  onCapture: (file: File, previewUrl: string) => void
  onClose: () => void
}

export default function NudeBodyCamera({
  onCapture,
  onClose,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null

    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'environment',
          },
        })
        .then((s) => {
          stream = s

          if (videoRef.current) {
            videoRef.current.srcObject = s
            void videoRef.current.play()
          }
        })
        .catch(() => setCameraError(true))
    } else {
      setCameraError(true)
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth || 720
    canvas.height = video.videoHeight || 960

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    canvas.toBlob(
      (blob) => {
        if (!blob) return

        const file = new File(
          [blob],
          `body-check-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
          },
        )

        const previewUrl =
          URL.createObjectURL(file)

        onCapture(file, previewUrl)
      },
      'image/jpeg',
      0.8,
    )
  }

  const onFile = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      e.target.value = ''
      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    onCapture(file, previewUrl)

    e.target.value = ''
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black">
      <header
        className="absolute inset-x-0 top-0 z-20 px-6"
        style={{
          paddingTop:
            'calc(env(safe-area-inset-top) + 20px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-6 w-6 items-center justify-center text-white"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <h1 className="text-sm font-bold text-white">
            눈바디 촬영하기
          </h1>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {!cameraError ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-[11px] leading-relaxed text-white/70">
            카메라를 사용할 수 없어요.
            <br />
            아래 갤러리 아이콘으로 사진을 올려주세요.
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-5 bottom-[145px] top-[92px] z-10 rounded-[22px] border-2 border-[#F4D447]">
          <span className="absolute right-4 top-4 text-[16px] text-[#F4D447]">
            ✦
          </span>

          <span className="absolute bottom-4 left-4 text-[13px] text-[#F4D447]">
            ✦
          </span>
        </div>

        <p className="absolute inset-x-0 bottom-[115px] z-10 text-center text-[10px] font-medium text-white drop-shadow">
          전신 앞모습이 나올 수 있도록 촬영해주세요!
        </p>

        <div className="absolute inset-x-0 bottom-8 z-10 grid grid-cols-3 items-center px-12">
          <label
            aria-label="갤러리에서 선택"
            className="flex h-11 w-11 cursor-pointer items-center justify-center justify-self-start text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 drop-shadow"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="M21 16l-5-5-4 4-2-2-7 7" />
            </svg>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFile}
            />
          </label>

          <button
            type="button"
            onClick={capture}
            disabled={cameraError}
            aria-label="촬영"
            className="h-[66px] w-[66px] justify-self-center rounded-full border-[5px] border-white bg-white/25 disabled:opacity-40"
          />

          <span className="h-11 w-11 justify-self-end" />
        </div>
      </div>
    </div>
  )
}