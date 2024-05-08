import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../model/recipe.interface';
import { Like } from '../model/like.interface';
import { Comment } from '../model/comment.interface';
import { MealPlan } from '../model/meal-plan.interface';
import { Meal } from '../model/meal.interface';
import { Rating } from '../model/rating.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private firestore: AngularFirestore) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes').valueChanges({ idField: 'recipeId' });
  }

  addRecipe(recipe: Recipe): Promise<DocumentReference<Recipe>> {
    const recipeCollection = this.firestore.collection<Recipe>('recipes');
    const id = this.firestore.createId();
    const recipeWithId: Recipe = { ...recipe, recipeId: id };
    return recipeCollection.add(recipeWithId);
  }

  getRecipeById(recipeId: string): Observable<Recipe | undefined> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).valueChanges();
  }

  updateRecipe(recipeId: string, changes: Partial<Recipe>): Promise<void> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).update(changes);
  }

  deleteRecipe(recipeId: string): Promise<void> {
    return this.firestore.doc<Recipe>(`recipes/${recipeId}`).delete();
  }

  searchRecipes(keyword: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('title', '>=', keyword).where('title', '<=', keyword + '\uf8ff')
    ).valueChanges({ idField: 'recipeId' });
  }

  filterRecipesByCuisine(cuisine: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('cuisine', '==', cuisine)
    ).valueChanges({ idField: 'recipeId' });
  }

  filterRecipesByCookingTime(maxCookingTime: number): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('cookingTime', '<=', maxCookingTime)
    ).valueChanges({ idField: 'recipeId' });
  }
  getLikeCountForRecipe(recipeId: string): Observable<number> {
    return this.firestore.collection<Like>('likes', ref =>
      ref.where('recipeId', '==', recipeId)
    ).valueChanges().pipe(
      map(likes => likes.length) 
    );
  }

  likeRecipe(recipeId: string, userId: string): Promise<void> {
    const like: Like = { userId, recipeId };
    return this.firestore.collection('likes').doc(`${userId}_${recipeId}`).set(like);
  }

  unlikeRecipe(recipeId: string, userId: string): Promise<void> {
    return this.firestore.collection('likes').doc(`${userId}_${recipeId}`).delete();
  }

  hasLikedRecipe(recipeId: string, userId: string): Observable<boolean> {
    return this.firestore.doc<Like>(`likes/${userId}_${recipeId}`).valueChanges()
      .pipe(
        map(like => !!like)
      );
  }
  commentOnRecipe(recipeId: string, comment: string, userId: string): Promise<DocumentReference<Comment>> {
    const commentData: Comment = {
      userId,
      recipeId,
      comment,
      createdAt: new Date()
    };
    return this.firestore.collection<Comment>('comments').add(commentData);
  }

  getCommentsForRecipe(recipeId: string): Observable<Comment[]> {
    return this.firestore.collection<Comment>('comments', ref =>
      ref.where('recipeId', '==', recipeId).orderBy('createdAt', 'desc')
    ).valueChanges();
  }

  getRecipesByUserId(userId: string): Observable<Recipe[]> {
    return this.firestore.collection<Recipe>('recipes', ref =>
      ref.where('authorId', '==', userId)
    ).valueChanges({ idField: 'recipeId' });
  }

  addRatingToRecipe(recipeId: string, userId: string, rating: number): Promise<DocumentReference<Rating>> {
    const ratingData: Rating = {
      userId,
      rating,
      createdAt: new Date()
    };
    return this.firestore.collection<Rating>(`recipes/${recipeId}/ratings`).add(ratingData);
  }

  getAverageRatingForRecipe(recipeId: string): Observable<number> {
    return this.firestore.collection<Rating>(`recipes/${recipeId}/ratings`).valueChanges().pipe(
      map(ratings => {
        if (ratings.length === 0) {
          return 0;
        }
        const totalRating = ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
        return totalRating / ratings.length;
      })
    );
  }
  
  getTotalRatingsForRecipe(recipeId: string): Observable<number> {
    return this.firestore.collection<Rating>(`recipes/${recipeId}/ratings`).valueChanges().pipe(
      map(ratings => ratings.length)
    );
  }

  createMealPlan(userId: string, date: string, meals: Meal[]): Promise<void> {
    const mealPlan: MealPlan = { userId, date, meals };
    return this.firestore.collection<MealPlan>('meal-plans').doc(`${userId}_${date}`).set(mealPlan, { merge: true });
  }
  

  getMealPlan(userId: string, date: string): Observable<MealPlan | undefined> {
    return this.firestore.doc<MealPlan>(`meal-plans/${userId}_${date}`).valueChanges();
  }
  updateMealPlan(userId: string, date: string, meals: Meal[]): Promise<void> {
    const mealPlan: MealPlan = { userId, date, meals };
    return this.firestore.collection<MealPlan>('meal-plans').doc(`${userId}_${date}`).set(mealPlan);
  }
  deleteMealPlan(userId: string, date: string): Promise<void> {
    return this.firestore.collection('meal-plans').doc(`${userId}_${date}`).delete();
  }
      
}
