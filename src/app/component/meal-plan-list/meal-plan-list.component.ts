import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../shared/recipe.service';
import { MealPlan } from '../../model/meal-plan.interface';
import { AuthService } from '../../shared/auth.service';
import { Recipe } from '../../model/recipe.interface';
import { Router } from '@angular/router';
import { Ingredient } from '../../model/ingredient.interface';

@Component({
  selector: 'app-meal-plan-list',
  templateUrl: './meal-plan-list.component.html',
  styleUrls: ['./meal-plan-list.component.css']
})
export class MealPlanListComponent implements OnInit {
  selectedDate: string = '';
  mealPlans: MealPlan[] = [];
  recipeTitles: { [recipeId: string]: string } = {}; 
  recipeIngredients: { [recipeId: string]: Ingredient[] } = {};


  constructor(private recipeService: RecipeService, private authService: AuthService, private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  onDateChange(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.recipeService.getMealPlan(userId, this.selectedDate).subscribe(
          (mealPlan) => {
            this.mealPlans = mealPlan ? [mealPlan] : [];
            console.log(mealPlan);
            // Fetch recipe titles for the meals in the meal plan

            this.mealPlans.forEach(plan => {
              plan.meals.forEach(meal => {
                this.fetchRecipeTitle(meal.recipeId);
                this.fetchRecipeIngredients(meal.recipeId);

              });
            });
          },
          (error) => {
            console.error('Error fetching meal plan:', error);
          }
        );
      } else {
        console.error('User not logged in.');
      }
    });
  }

  fetchRecipeTitle(recipeId: string): void {
    if (!this.recipeTitles[recipeId]) { 
      this.recipeService.getRecipeById(recipeId).subscribe((recipe: Recipe | undefined) => {
        if (recipe) {
          this.recipeTitles[recipeId] = recipe.title; // Cache the title
        }
      });
    }
  }

  fetchRecipeIngredients(recipeId: string): void {
    if (!this.recipeIngredients[recipeId]) { 
      this.recipeService.getRecipeById(recipeId).subscribe((recipe: Recipe | undefined) => {
        if (recipe) {
          this.recipeIngredients[recipeId] = recipe.ingredients; 
        }
      });
    }
  }
  

  getRecipeTitle(recipeId: string): string {
    return this.recipeTitles[recipeId] || 'Loading...'; // Return the title if it's in the cache, otherwise show 'Loading...'
  }
  navigateToMealPlanning(): void {
    this.router.navigate(['/meal-planning']);
  }
}
