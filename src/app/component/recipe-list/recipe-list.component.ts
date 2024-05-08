import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  userId: string='';
  filteredRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService ,private auth: AuthService,private router: Router,
  ) {
    this.auth.userId$.subscribe(id => {
      this.userId = id;
    });
    if (!this.userId) {
      // Redirect to login page if userId is not available
      this.router.navigate(['/login']);
      return; // Stop further execution
    }
   }

  ngOnInit(): void {
    this.fetchRecipes();
    
  }
  searchRecipes(event: any): void {
    const keyword = event.target.value.toLowerCase();

    if (keyword.trim() === '') {
      // If the search keyword is empty, display all recipes
      this.fetchRecipes();
    } else {
      // Otherwise, search for recipes based on the keyword
      this.recipeService.searchRecipes(keyword).subscribe(recipes => {
        this.recipes = recipes;
        this.updateLikeCounts();
        this.updateAverageRatings();
      });
    }
  }
  fetchRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
      // Fetch and update like counts for each recipe
      this.updateLikeCounts();
      this.updateAverageRatings();
    });
  }

  updateAverageRatings(): void {
    this.recipes.forEach(recipe => {
      this.recipeService.getAverageRatingForRecipe(recipe.recipeId).subscribe(averageRating => {
        recipe.averageRating = averageRating; // Assuming you have an averageRating field in your Recipe interface
      });
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
    if (recipe.isLiked) {
      recipe.isLiked = false;
      if (recipe.likeCount !== undefined) {
        recipe.likeCount--;
      }

      // Send unlike request to the server
      this.recipeService.unlikeRecipe(recipe.recipeId, this.userId)
        .catch(error => {
          recipe.isLiked = true;
          if (recipe.likeCount !== undefined) {
            recipe.likeCount++;
          }
          console.error('Failed to unlike recipe:', error);
        });
    } else {
      recipe.isLiked = true;
      if (recipe.likeCount !== undefined) {
        recipe.likeCount++;
      }

      // Send like request to the server
      this.recipeService.likeRecipe(recipe.recipeId, this.userId)
        .catch(error => {
          recipe.isLiked = false;
          if (recipe.likeCount !== undefined) {
            recipe.likeCount--;
          }
          console.error('Failed to like recipe:', error);
        });
    }
  }
}
