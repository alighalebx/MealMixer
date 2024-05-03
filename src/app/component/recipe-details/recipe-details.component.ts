import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../model/recipe.interface';
import { RecipeService } from '../../shared/recipe.service';
import { UserService } from '../../shared/user.service'; // Import UserService

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipeId: string | undefined;
  recipe: Recipe | undefined;
  authorName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService // Inject UserService
  ) { }

  ngOnInit(): void {
    // Get the recipeId from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipeId = id;
        // Fetch recipe details using recipeId
        this.recipeService.getRecipeById(this.recipeId).subscribe(recipe => {
          this.recipe = recipe;
          if (recipe) {
            // Fetch author's name based on authorId
            this.userService.getUserNameById(recipe.authorId).subscribe(name => {
              this.authorName = name;
            });
          }
        });
      } else {
        console.error('Recipe ID is null');
      }
    });
  }
}
