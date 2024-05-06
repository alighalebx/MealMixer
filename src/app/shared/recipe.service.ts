import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../model/recipe.interface';
import { Like } from '../model/like.interface';
import { Comment } from '../model/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private firestore: AngularFirestore) { }

  // Get all recipes
  getAllRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes').valueChanges({ idField: 'recipeId' });
  }

  // Add a new recipe
  addRecipe(recipe: Recipe): Promise<DocumentReference<Recipe>> {
    const recipeCollection = this.firestore.collection<Recipe>('recipes');
    const id = this.firestore.createId();
    const recipeWithId: Recipe = { ...recipe, recipeId: id };
    return recipeCollection.add(recipeWithId);
  }

  // Get a recipe by its ID
  getRecipeById(recipeId: string): Observable<Recipe | undefined> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).valueChanges();
  }

  // Update an existing recipe
  updateRecipe(recipeId: string, changes: Partial<Recipe>): Promise<void> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).update(changes);
  }

  // Delete a recipe
  deleteRecipe(recipeId: string): Promise<void> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).delete();
  }

  // Search recipes by keyword
  searchRecipes(keyword: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('title', '>=', keyword).where('title', '<=', keyword + '\uf8ff')
    ).valueChanges({ idField: 'recipeId' });
  }

  // Filter recipes by cuisine
  filterRecipesByCuisine(cuisine: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('cuisine', '==', cuisine)
    ).valueChanges({ idField: 'recipeId' });
  }

  // Filter recipes by cooking time
  filterRecipesByCookingTime(maxCookingTime: number): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('cookingTime', '<=', maxCookingTime)
    ).valueChanges({ idField: 'recipeId' });
  }
  getLikeCountForRecipe(recipeId: string): Observable<number> {
    return this.firestore.collection<Like>('likes', ref =>
      ref.where('recipeId', '==', recipeId)
    ).valueChanges().pipe(
      map(likes => likes.length) // Count the number of likes
    );
  }

  likeRecipe(recipeId: string, userId: string): Promise<void> {
    const like: Like = { userId, recipeId };
    return this.firestore.collection('likes').doc(`${userId}_${recipeId}`).set(like);
  }

  // Unlike a recipe
  unlikeRecipe(recipeId: string, userId: string): Promise<void> {
    return this.firestore.collection('likes').doc(`${userId}_${recipeId}`).delete();
  }

  // Check if a user has liked a recipe
  hasLikedRecipe(recipeId: string, userId: string): Observable<boolean> {
    return this.firestore.doc<Like>(`likes/${userId}_${recipeId}`).valueChanges()
      .pipe(
        map(like => !!like)
      );
  }
  // Comment on a recipe
  commentOnRecipe(recipeId: string, comment: string, userId: string): Promise<DocumentReference<Comment>> {
    const commentData: Comment = {
      userId,
      recipeId,
      comment,
      createdAt: new Date()
    };
    return this.firestore.collection<Comment>('comments').add(commentData);
  }

  // Get comments for a recipe
  getCommentsForRecipe(recipeId: string): Observable<Comment[]> {
    return this.firestore.collection<Comment>('comments', ref =>
      ref.where('recipeId', '==', recipeId).orderBy('createdAt', 'desc')
    ).valueChanges();
  }

  // Get recipes posted by a specific user
  getRecipesByUserId(userId: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('authorId', '==', userId)
    ).valueChanges({ idField: 'recipeId' });
  }
}
