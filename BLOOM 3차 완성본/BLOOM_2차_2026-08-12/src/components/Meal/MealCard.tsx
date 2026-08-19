import { useState } from "react";
import type { Meal } from "../types/Meal";
import MealDetail from "./MealDetail";
import { IconChevronDown, IconChevronUp } from "../icons";

type MealCardProps = {
  meal: Meal;
  onEdit?: () => void;
};

export default function MealCard({ meal, onEdit }: MealCardProps) {
  const [isOpen, setIsOpen] = useState(false);

 const hasDetail =
  meal.calories !== null ||
  meal.carbs !== undefined ||
  meal.protein !== undefined ||
  meal.fat !== undefined;

  return (
    <>
      <div className="flex items-start justify-between">
        <h2 className="text-[14px] font-bold leading-none text-gray-900">
          {meal.type}
        </h2>

        <div className="flex items-center gap-2.5">
          <span className="text-[8px] text-gray-500">
            {meal.time}
          </span>

          <button
            onClick={onEdit}
            aria-label="식단 수정"
            className="text-[16px] leading-none text-gray-500"
          >
            ⋮
          </button>
        </div>
      </div>

      <div className="relative mt-4 min-h-[36px]">
        <p className="ml-2 pr-[88px] text-[11px] leading-4 text-gray-600">
          {meal.menu}
        </p>

        <p className="absolute bottom-0 right-0 whitespace-nowrap text-[20px] font-bold leading-none text-gray-900">
          {meal.calories !== null
            ? `${meal.calories} kcal`
            : "- kcal"}
        </p>
      </div>

      {isOpen && hasDetail && (
        <MealDetail meal={meal} />
      )}

      {hasDetail && (
        <div className="-mb-1 mt-0.5 flex justify-center">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-4 w-full items-center justify-center"
          >
            {isOpen ? (
              <IconChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <IconChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      )}
    </>
  );
}