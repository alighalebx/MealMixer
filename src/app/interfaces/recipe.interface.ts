// recipe.interface.ts

import { Ingredient } from "./ingredient.interface";

export interface Recipe {
    title: string;
    authorId: string;
    ingredients: Ingredient[];
    instructions: string[];
    photoURL?: string;
    cuisine: string;
    cookingTime: number;
    createdAt: Date;
  }
  