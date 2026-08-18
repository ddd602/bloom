import type { Meal } from "../types/Meal";
import MealCard from "./MealCard";

type MealTimelineProps = {
  meals: Meal[];
  onSelect?: (index: number) => void;
};

export default function MealTimeline({ meals, onSelect }: MealTimelineProps) {
  return (
    <section className="mt-7 px-6">
      {meals.map((meal, index) => {
        const isLast = index === meals.length - 1;
        const isEmpty = meal.calories === null;

        return (
          <div key={meal.id} className="flex">
            <div className="mr-3 flex w-5 flex-col items-center">
              <div
                className={`h-3 w-3 shrink-0 rounded-full border-2 border-[#32DE8B] ${
                  meal.calories !== null
                    ? "bg-[#32DE8B]"
                    : "bg-white"
                }`}
              />

              {!isLast && (
                <div className="my-1 h-full min-h-[92px] w-[1.5px] bg-[#32DE8B]" />
              )}
            </div>

            <div
              onClick={isEmpty ? () => onSelect?.(index) : undefined}
              className={
                "mb-4 flex-1 rounded-[10px] bg-[#F5F5F6] px-4 pb-2 pt-4 " +
                (isEmpty ? "cursor-pointer" : "")
              }
            >
              <MealCard
                meal={meal}
                onEdit={() => onSelect?.(index)}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}