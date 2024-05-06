// recipe.interface.ts

import { Ingredient } from "./ingredient.interface";

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
    likeCount?: number; // Add likeCount property
    isLiked?: boolean; // Add isLiked property
  }
  