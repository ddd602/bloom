import {
  useState,
} from 'react'

type Props = {
  value: string
  onChange: (
    text: string,
  ) => void

  editing: boolean

  onEditingChange: (
    editing: boolean,
  ) => void

  onSave: () => Promise<void>
}

function ConditionMemo({
  value,
  onChange,
  editing,
  onEditingChange,
  onSave,
}: Props) {
  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const handleSave =
    async () => {
      if (saving) {
        return
      }

      try {
        setSaving(
          true,
        )

        await onSave()
      } catch (error) {
        console.error(
          '메모 저장에 실패했습니다.',
          error,
        )
      } finally {
        setSaving(
          false,
        )
      }
    }

  return (
    <div>
      <div
        className={
          'relative min-h-[78px] rounded-lg border p-3 transition-colors ' +
          (
            editing
              ? 'border-[#31C66B] bg-white'
              : 'border-[#64DE98] bg-[#F1FFF6]'
          )
        }
      >
        <p className="mb-2 text-[11px] font-semibold text-gray-700">
          컨디션 메모
        </p>

        {editing ? (
          <textarea
            autoFocus
            value={
              value
            }
            onChange={(
              e,
            ) =>
              onChange(
                e.target.value,
              )
            }
            placeholder="오늘 컨디션을 기록해보세요"
            rows={3}
            className="
              w-full resize-none
              bg-transparent
              text-[10px] text-gray-600
              outline-none
              placeholder:text-gray-400
            "
          />
        ) : (
          <button
            type="button"
            onClick={() =>
              onEditingChange(
                true,
              )
            }
            className="block w-full text-left"
          >
            <span
              className={
                'block min-h-[1rem] whitespace-pre-wrap pr-6 text-[10px] ' +
                (
                  value
                    ? 'text-gray-600'
                    : 'text-gray-400'
                )
              }
            >
              {value ||
                '메모 없음'}
            </span>
          </button>
        )}

        {!editing && (
          <button
            type="button"
            onClick={() =>
              onEditingChange(
                true,
              )
            }
            aria-label="메모 수정"
            className="absolute bottom-3 right-3 text-[14px] text-gray-400"
          >
            ✎
          </button>
        )}
      </div>

      {editing && (
        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className={
            'mt-2 w-full rounded-xl py-3 text-sm font-bold ' +
            (
              saving
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-[#31C66B] text-white active:bg-[#29B760]'
            )
          }
        >
          {saving
            ? '저장 중...'
            : '수정 완료'}
        </button>
      )}
    </div>
  )
}

export default ConditionMemo