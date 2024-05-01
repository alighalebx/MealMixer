import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.css']
})
export class RecipeCreationComponent {
  recipeForm: FormGroup;
  selectedImage: File | null = null;
  imageURL: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private storage: AngularFireStorage // Inject AngularFireStorage
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
    if (this.recipeForm.valid && this.selectedImage) {
      // Upload image to Firebase Cloud Storage
      const filePath = `recipe_images/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedImage);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            // Image uploaded successfully, now create the recipe with image URL
            this.createRecipe(url);
          });
        })
      ).subscribe();
    } else {
      // Handle form validation errors or missing image
    }
  }

  createRecipe(imageURL: string): void {
    const newRecipe: Recipe = {
      recipeId: '',
      title: this.recipeForm.value.title,
      authorId: this.authService.userId,
      ingredients: this.recipeForm.value.ingredients,
      instructions: this.recipeForm.value.instructions,
      cuisine: this.recipeForm.value.cuisine,
      cookingTime: this.recipeForm.value.cookingTime,
      createdAt: this.recipeForm.value.createdAt,
      photoURL: imageURL // Assign imageURL to photoURL property
    };

    this.recipeService.addRecipe(newRecipe).then(() => {
      console.log('Recipe added successfully');
      this.recipeForm.reset();
    }).catch(error => {
      console.error('Error adding recipe:', error);
    });
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }
  getIngredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  
  getInstructionsControls() {
    return (this.recipeForm.get('instructions') as FormArray).controls;
  }
}