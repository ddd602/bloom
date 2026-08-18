type Props = {
  totalCalories: number
  targetCalories?: number
  yesterdayCalories?: number
}

export default function CalroriesDescription({
  totalCalories,
  targetCalories,
  yesterdayCalories,
}: Props) {
  const difference =
    yesterdayCalories !== undefined
      ? yesterdayCalories - totalCalories
      : null

  return (
    <>
      <p className="text-sm font-semibold text-gray-700">
        일일 섭취량
      </p>

      <div className="mt-1 flex items-end gap-2">
        <span className="text-2xl font-bold">
          {totalCalories.toLocaleString()} kcal
        </span>

        {targetCalories !== undefined && (
          <span className="pb-1 text-sm font-semibold text-gray-600">
            / {targetCalories.toLocaleString()} kcal
          </span>
        )}
      </div>

      {difference !== null && (
        <p className="mt-2 text-xs text-gray-500">
          {difference > 0
            ? `어제보다 ${difference.toLocaleString()} kcal 덜 섭취했어요!`
            : difference < 0
              ? `어제보다 ${Math.abs(difference).toLocaleString()} kcal 더 섭취했어요!`
              : '어제와 같은 양을 섭취했어요!'}
        </p>
      )}
    </>
  )
}