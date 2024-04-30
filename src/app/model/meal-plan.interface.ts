import { Meal } from "./meal.interface";

export interface MealPlan {
    userId: string;
    date: string; // Consider using Date type if Firestore supports it
    meals: Meal[];
  }