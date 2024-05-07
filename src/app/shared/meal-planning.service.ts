import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MealPlan } from '../model/meal-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class MealPlanningService {

  constructor(private firestore: AngularFirestore) { }

  // Add a new meal plan
  addMealPlan(mealPlan: MealPlan): Promise<DocumentReference<MealPlan>> {
    const mealPlanCollection = this.firestore.collection<MealPlan>('mealPlans');
    return mealPlanCollection.add(mealPlan);
  }

  // Update an existing meal plan
  updateMealPlan(mealPlanId: string, changes: Partial<MealPlan>): Promise<void> {
    return this.firestore.doc<MealPlan>(`mealPlans/${mealPlanId}`).update(changes);
  }

  // Delete a meal plan
  deleteMealPlan(mealPlanId: string): Promise<void> {
    return this.firestore.doc<MealPlan>(`mealPlans/${mealPlanId}`).delete();
  }

  // Get meal plans for a specific user and date
  getMealPlansForUserAndDate(userId: string, date: string): Observable<MealPlan[]> {
    return this.firestore.collection<MealPlan>('mealPlans', ref =>
      ref.where('userId', '==', userId).where('date', '==', date)
    ).valueChanges();
  }
}
