import {
  useEffect,
  useRef,
  useState,
} from 'react'

type Props = {
  onCapture: (
    file: File,
    previewUrl: string,
  ) => void
  onClose?: () => void
}

export default function CameraScan({
  onCapture,
  onClose,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement>(
      null,
    )

  const [
    cameraError,
    setCameraError,
  ] =
    useState(false)

  useEffect(() => {
    let stream:
      | MediaStream
      | null = null

    if (
      navigator.mediaDevices
        ?.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode:
              'environment',
          },
        })
        .then((s) => {
          stream = s

          if (
            videoRef.current
          ) {
            videoRef.current.srcObject =
              s

            void videoRef.current.play()
          }
        })
        .catch(() =>
          setCameraError(
            true,
          ),
        )
    } else {
      setCameraError(
        true,
      )
    }

    return () => {
      stream
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop(),
        )
    }
  }, [])

  const capture = () => {
    const video =
      videoRef.current

    if (!video) return

    const canvas =
      document.createElement(
        'canvas',
      )

    canvas.width =
      video.videoWidth ||
      720

    canvas.height =
      video.videoHeight ||
      960

    const ctx =
      canvas.getContext(
        '2d',
      )

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

        const file =
          new File(
            [blob],
            `meal-${Date.now()}.jpg`,
            {
              type:
                'image/jpeg',
            },
          )

        const previewUrl =
          URL.createObjectURL(
            file,
          )

        onCapture(
          file,
          previewUrl,
        )
      },
      'image/jpeg',
      0.8,
    )
  }

  const onFile = (
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

    onCapture(
      file,
      previewUrl,
    )

    e.target.value = ''
  }

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
      {!cameraError ? (
        <video
          ref={
            videoRef
          }
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-xs leading-relaxed text-white/70">
          카메라를 사용할 수 없어요.
          <br />
          아래 갤러리 아이콘으로 사진을 올려주세요.
        </div>
      )}

      {onClose && (
        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="닫기"
          className="absolute left-3 top-3 z-20 text-2xl leading-none text-white drop-shadow"
        >
          ‹
        </button>
      )}

      <div className="absolute inset-x-0 top-5 z-10 text-center">
        <p className="text-xl font-extrabold text-white drop-shadow">
          식사를 스캔해주세요!
        </p>

        <p className="mt-1 text-[11px] text-white/80 drop-shadow">
          AI가 사진을 인식해 분석해요
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-32 top-24 z-10 rounded-2xl border-2 border-yellow-400" />

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-12">
        <label
          aria-label="갤러리에서 선택"
          className="flex h-11 w-11 cursor-pointer items-center justify-center text-white"
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
            className="h-8 w-8 drop-shadow"
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
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={
              onFile
            }
          />
        </label>

        <button
          type="button"
          onClick={
            capture
          }
          disabled={
            cameraError
          }
          aria-label="촬영"
          className="h-16 w-16 rounded-full border-4 border-white bg-white/30 shadow disabled:opacity-40"
        />

        <span className="h-11 w-11" />
      </div>
    </div>
  )
}