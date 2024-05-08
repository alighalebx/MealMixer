// recipe.interface.ts
import { Ingredient } from "./ingredient.interface";
import { Rating } from "./rating.interface";

export interface Recipe {
  recipeId: string;
  title: string;
  authorId: string;
  ingredients: Ingredient[];
  instructions: string[];
  photoURL?: string;
  cuisine: string;
  cookingTime: number;
  createdAt: Date;
  likeCount?: number;
  isLiked?: boolean;
  averageRating?: number;
  totalRatings?: number; 
}
