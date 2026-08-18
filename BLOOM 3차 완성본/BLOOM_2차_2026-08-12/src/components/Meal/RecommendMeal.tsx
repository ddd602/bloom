//백엔드에서 받은 데이터를 여기에 적어야함
const recommendedMeals = [
  {
    calories: 510,
    name: "연어 샐러드 플레이트",
  },
  {
    calories: 510,
    name: "포케",
  },
  {
    calories: 590,
    name: "소고기 미역국 정식",
  },
];

export default function RecommendedMeal(){
    return (
        <>
        
        <section className="mt-3 px-5">
        <h2 className="text-lg font-bold">
          추천 식단
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          아직 식사를 안했다면, 이런 식단은 어떨까요?
        </p>
        
        {/* 이 부분은 백엔드 연동 필요 */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {recommendedMeals.map((meal, index) => (
            <article
              key={index}
              className="min-w-[110px] rounded-lg bg-gray-100 p-3"
            >
              <p className="text-xs text-gray-500">
                최적
              </p>

              <p className="mt-1 text-lg font-bold">
                {meal.calories} kcal
              </p>

              <p className="mt-3 text-sm font-medium leading-5">
                {meal.name}
              </p>
            </article>
          ))}
        </div>
      </section>
        </>
    );
}