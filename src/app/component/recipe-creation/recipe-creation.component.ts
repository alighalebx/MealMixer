import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../shared/recipe.service';
import { Recipe } from '../../model/recipe.interface';
import { AuthService } from '../../shared/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
  styleUrls: ['./recipe-creation.component.css']
})
export class RecipeCreationComponent implements OnInit {
  recipeForm: FormGroup;
  selectedImage: File | null = null;
  imageURL: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      ingredients: this.formBuilder.array([this.createIngredient()]),
      instructions: this.formBuilder.array([this.formBuilder.control('', Validators.required)]),
      cuisine: ['', Validators.required],
      cookingTime: ['', Validators.required],
      createdAt: ['', Validators.required],
      photoURL: ['']
    });
  }
  ngOnInit(): void {
    this.authService.userId$.pipe(take(1)).subscribe(userId => {
      if (!userId) {
        // Redirect to login page if userId is not available
        this.router.navigate(['/login']);
        return; // Stop further execution
      }
  });
}

  
  createIngredient(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  addIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  addInstruction(): void {
    (this.recipeForm.get('instructions') as FormArray).push(this.formBuilder.control('', Validators.required));
  }

  removeInstruction(index: number): void {
    (this.recipeForm.get('instructions') as FormArray).removeAt(index);
  }

  // ... rest of your component code ...


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
    this.authService.userId$.pipe(take(1)).subscribe(userId => {
      const newRecipe: Recipe = {
        recipeId: '',
        title: this.recipeForm.value.title,
        authorId: userId,
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