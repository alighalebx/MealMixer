import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    // Retrieve user ID from route parameters
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        // Fetch user data
        this.userData$ = this.firestore.doc<any>(`users/${userId}`).valueChanges();

        // Fetch recipes uploaded by the user
        this.userRecipes$ = this.firestore.collection<any>(`recipes`, ref => ref.where('userId', '==', userId)).valueChanges();

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
      }
    });
  }
  navigateToMealPlanning(): void {
    this.router.navigate(['/meal-planning']); // Navigate to the meal planning page
  }
}
