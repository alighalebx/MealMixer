import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';


@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.css']
})
export class RecipeCreationComponent {
  recipeForm: FormGroup;
  // userId: string;

  constructor(
    private formBuilder: FormBuilder, 
    private recipeService: RecipeService,
    private authService: AuthService // Inject AuthService
  ) {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      ingredients: this.formBuilder.array([]),
      instructions: this.formBuilder.array([]),
      cuisine: ['', Validators.required],
      cookingTime: ['', Validators.required],
      createdAt: ['', Validators.required],
      photoURL: ['']
    });

    
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const newRecipe: Recipe = {
        recipeId: '', 
        title: this.recipeForm.value.title,
        authorId: this.authService.userId, // Set authorId to userId
        ingredients: this.recipeForm.value.ingredients,
        instructions: this.recipeForm.value.instructions,
        cuisine: this.recipeForm.value.cuisine,
        cookingTime: this.recipeForm.value.cookingTime,
        createdAt: this.recipeForm.value.createdAt,
        photoURL: this.recipeForm.value.photoURL
      };

      this.recipeService.addRecipe(newRecipe).then(() => {
        console.log('Recipe added successfully');
        this.recipeForm.reset();
      }).catch(error => {
        console.error('Error adding recipe:', error);
      });
    }
  }
  getIngredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  
  getInstructionsControls() {
    return (this.recipeForm.get('instructions') as FormArray).controls;
  }
}