import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RecipeService } from '../../shared/recipe.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData$?: Observable<any>;
  userRecipes$?: Observable<any[]>;
  followersCount: number = 0;
  followingCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    // Retrieve user ID from route parameters
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (!userId) {
        // Redirect to login page if userId is not available
        this.router.navigate(['/login']);
        return; // Stop further execution
      }
      // Fetch user data
      this.userData$ = this.firestore.doc<any>(`users/${userId}`).valueChanges();

      // Fetch recipes uploaded by the user
      this.userRecipes$ = this.recipeService.getRecipesByUserId(userId);
      
      // Fetch followers count
      this.firestore.doc<any>(`users/${userId}`).valueChanges()
        .subscribe((userDoc: any) => {
          this.followersCount = userDoc.followers ? userDoc.followers.length : 0; // Update followers count
        });

      // Fetch following count
      this.firestore.collection(`users/${userId}/following`).valueChanges()
        .subscribe(following => {
          this.followingCount = following.length; // Update following count
        });
    });
  }
  navigateToMealPlanning(): void {
    this.router.navigate(['/selected-meal-planning']); // Navigate to the meal planning page
  }
}
