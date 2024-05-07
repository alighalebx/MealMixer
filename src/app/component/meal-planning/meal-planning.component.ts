// meal-planning.component.ts

import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meal-planning',
  templateUrl: './meal-planning.component.html',
  styleUrls: ['./meal-planning.component.css']
})
export class MealPlanningComponent implements OnInit {
  selectedDate: string = '';
  selectedMealType: string | null = null;
  recipes: Recipe[] = [];
  mealPlan: { [key: string]: Recipe } = {}; // Store selected recipes for each meal type
  selectedRecipes: { [key: string]: boolean } = {}; // Track selected recipes

  constructor(private recipeService: RecipeService, private authService: AuthService, private snackBar: MatSnackBar // Inject MatSnackBar
) {}

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  fetchRecipes(mealType: string): void {
    this.selectedMealType = mealType;
    this.recipeService.getAllRecipes()
      .subscribe(recipes => {
        this.recipes = recipes;
      });
  }

  selectMeal(recipe: Recipe): void {
    if (!this.selectedMealType) return;
    this.mealPlan[this.selectedMealType] = recipe;
    this.selectedRecipes[recipe.recipeId] = true; // Mark the recipe as selected
  }

  saveMealPlan(): void {
    if (!this.selectedDate || !this.authService.userId) return;
    const meals = Object.keys(this.mealPlan).map(mealType => ({
      name: mealType,
      recipeId: this.mealPlan[mealType].recipeId
    }));
    this.recipeService.createMealPlan(this.authService.userId, this.selectedDate, meals)
      .then(() => {
        this.snackBar.open('Meal plan saved successfully', 'Close', { duration: 7000 }); // Show notification
        console.log('ADDED MEAL');

        this.mealPlan = {};
        this.selectedRecipes = {}; // Reset selected recipes
      })
      .catch(error => {
        console.error('Error saving meal plan:', error);
      });
  }
}
