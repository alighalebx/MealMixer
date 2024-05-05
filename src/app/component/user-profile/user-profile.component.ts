import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { RecipeService } from '../../shared/recipe.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userData$: Observable<any> = of(null); // Initialize with null or an empty observable
  userRecipes$: Observable<any[]> = of([]); // Initialize with an empty observable

  constructor(private authService: AuthService, private recipeService: RecipeService) { }

  ngOnInit(): void {
    // Call getCurrentUser() from AuthService and subscribe to the returned Observable
    this.userData$ = this.authService.getCurrentUser();

    // Fetch recipes uploaded by the current user
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRecipes$ = this.recipeService.getRecipesByUserId(user.uid);
      }
    });
  }
}
