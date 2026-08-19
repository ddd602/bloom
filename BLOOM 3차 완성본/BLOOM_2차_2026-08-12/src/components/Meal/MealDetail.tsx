import type { Meal } from "../types/Meal";

type MealDetailProps = {
  meal: Meal;
};

export default function MealDetail({ meal }: MealDetailProps) {
  const carbs = meal.carbs ?? 0;
  const protein = meal.protein ?? 0;
  const fat = meal.fat ?? 0;

  const hasMacros =
    meal.carbs !== undefined ||
    meal.protein !== undefined ||
    meal.fat !== undefined;

  const total =
    carbs +
    protein +
    fat;

  const carbsPercent =
    total > 0
      ? (carbs / total) * 100
      : 0;

  const proteinPercent =
    total > 0
      ? (protein / total) * 100
      : 0;

  const fatPercent =
    total > 0
      ? (fat / total) * 100
      : 0;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-600">
          섭취 칼로리
        </p>

        <p className="text-[14px] font-semibold text-gray-800">
          {meal.calories ?? 0} kcal
        </p>
      </div>

      {hasMacros && (
        <>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full">
            <div
              className="bg-[#6AA58E]"
              style={{
                width: `${carbsPercent}%`,
              }}
            />

            <div
              className="bg-[#32C16D]"
              style={{
                width: `${proteinPercent}%`,
              }}
            />

            <div
              className="bg-[#63E49A]"
              style={{
                width: `${fatPercent}%`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 text-center">
            <div>
              <span className="mx-auto mb-2 block h-2 w-2 rounded-full bg-[#666666]" />
              <p className="text-[11px] text-gray-600">
                탄수화물
              </p>
              <p className="mt-1 text-[14px] font-semibold text-gray-800">
                {carbs}g
              </p>
            </div>

            <div>
              <span className="mx-auto mb-2 block h-2 w-2 rounded-full bg-[#32C16D]" />
              <p className="text-[11px] text-gray-600">
                단백질
              </p>
              <p className="mt-1 text-[14px] font-semibold text-gray-800">
                {protein}g
              </p>
            </div>

            <div>
              <span className="mx-auto mb-2 block h-2 w-2 rounded-full bg-[#63E49A]" />
              <p className="text-[11px] text-gray-600">
                지방
              </p>
              <p className="mt-1 text-[14px] font-semibold text-gray-800">
                {fat}g
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}