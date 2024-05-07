import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-meal-selection',
  templateUrl: './meal-selection.component.html',
  styleUrls: ['./meal-selection.component.css']
})
export class MealSelectionComponent {
  // @Input() mealType: string; // e.g., breakfast, lunch, dinner, snacks
  // @Input() recipes: string[]; // List of available recipes for the meal

  // selectedRecipe: string;

  constructor() { }

  selectRecipe(recipe: string) {
    // this.selectedRecipe = recipe;
  }
}
