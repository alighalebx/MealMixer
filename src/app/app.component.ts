import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected the property name to 'styleUrls'
})
export class AppComponent {
  title = 'MealMixer';

  constructor(private router: Router, private auth: AuthService) {}

  navigateToCreateRecipe() {
    // Use take(1) to get the current userId just for this navigation
    this.auth.userId$.pipe(take(1)).subscribe(authorId => {
      this.router.navigate(['recipes/create'], { queryParams: { authorId } });
    });
  }

  navigateToListRecipe() {
    // Use take(1) to get the current userId just for this navigation
    this.auth.userId$.pipe(take(1)).subscribe(authorId => {
      this.router.navigate(['recipes'], { queryParams: { authorId } });
    });
  }

  navigateToUserProfile() {
    // Use take(1) to get the current userId just for this navigation
    this.auth.userId$.pipe(take(1)).subscribe(userId => {
      this.router.navigate(['profile', userId]);
    });
  }

  navigateToFollowUsers() {
    this.router.navigate(['follow-users']);
  }
}
