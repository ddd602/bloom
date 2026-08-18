export type Meal = {
  id: number;
  type: string;
  time: string;
  menu: string;
  calories: number | null;
  carbs?: number;
  protein?: number;
  fat?: number;
};