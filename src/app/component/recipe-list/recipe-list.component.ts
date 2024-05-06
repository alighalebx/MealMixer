import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService ,private auth: AuthService) { }

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
      // Fetch and update like counts for each recipe
      this.updateLikeCounts();
    });
  }

  // Method to update like counts for each recipe
  updateLikeCounts(): void {
    this.recipes.forEach(recipe => {
      this.recipeService.getLikeCountForRecipe(recipe.recipeId).subscribe(count => {
        recipe.likeCount = count;
      });
    });
  }

  // Method to handle like/unlike button click
  toggleLike(recipe: Recipe): void {
    const userId = this.auth.userId;
    if (recipe.isLiked) {
      // Unlike the recipe optimistically
      recipe.isLiked = false;
      if (recipe.likeCount !== undefined) {
        recipe.likeCount--;
      }
  
      // Send unlike request to the server
      this.recipeService.unlikeRecipe(recipe.recipeId, userId)
        .catch(error => {
          // Revert local changes if server request fails
          recipe.isLiked = true;
          if (recipe.likeCount !== undefined) {
            recipe.likeCount++;
          }
          console.error('Failed to unlike recipe:', error);
        });
    } else {
      // Like the recipe optimistically
      recipe.isLiked = true;
      if (recipe.likeCount !== undefined) {
        recipe.likeCount++;
      }
  
      // Send like request to the server
      this.recipeService.likeRecipe(recipe.recipeId, userId)
        .catch(error => {
          // Revert local changes if server request fails
          recipe.isLiked = false;
          if (recipe.likeCount !== undefined) {
            recipe.likeCount--;
          }
          console.error('Failed to like recipe:', error);
        });
    }
  }
  
}
