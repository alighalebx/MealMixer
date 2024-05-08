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
  cuisineFilter: string | null = null;
  activeCuisine: string | null = null;

  constructor(private recipeService: RecipeService ,private auth: AuthService,private router: Router,
  ) {
    this.auth.userId$.subscribe(id => {
      this.userId = id;
    });
    if (!this.userId) {
      this.router.navigate(['/login']);
      return; 
    }
   }

  ngOnInit(): void {

    this.fetchRecipes();
    
    
  }
  searchRecipes(event: any): void {
    const keyword = event.target.value.toLowerCase();

    if (keyword.trim() === '') {
      this.fetchRecipes();
    } else {
      this.recipeService.searchRecipes(keyword).subscribe(recipes => {
        this.recipes = recipes;
        this.filteredRecipes = [...this.recipes]; 
        this.updateLikeCounts();
        this.updateAverageRatings();
      });
    }
  }
  fetchRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.updateLikeCounts();
      this.updateAverageRatings();
    });
  }

  updateAverageRatings(): void {
    this.recipes.forEach(recipe => {
      this.recipeService.getAverageRatingForRecipe(recipe.recipeId).subscribe(averageRating => {
        recipe.averageRating = averageRating; 
      });
    });
  }

  updateLikeCounts(): void {
    this.recipes.forEach(recipe => {
      this.recipeService.getLikeCountForRecipe(recipe.recipeId).subscribe(count => {
        recipe.likeCount = count;
      });
    });
  }

  toggleLike(recipe: Recipe): void {
    if (recipe.isLiked) {
      recipe.isLiked = false;
      if (recipe.likeCount !== undefined) {
        recipe.likeCount--;
      }

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

  applyCuisineFilter(cuisine: string | null = null): void {
    if (cuisine) {
      this.filteredRecipes = this.recipes.filter(recipe => recipe.cuisine === cuisine);
    } else {
      this.filteredRecipes = [...this.recipes];
    }
  }

  filterByCuisine(cuisine: string): void {
    this.activeCuisine = cuisine || '';
    this.applyCuisineFilter(this.activeCuisine);
  }
  

}
