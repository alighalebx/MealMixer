import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private auth: AuthService) { }

  navigateToCreateRecipe() {
    this.router.navigate(['recipes/create'], { queryParams: { authorId: this.auth.userId } });
  }
  navigateToListRecipe() {
    this.router.navigate(['recipes'], { queryParams: { authorId: this.auth.userId } });
  }
  navigateToUserProfile() {
    this.router.navigate(['profile', this.auth.userId]); // Navigate to user profile with userId as parameter
  }
  navigateToFollowUsers() {
    this.router.navigate(['follow-users']);
  }
  title = 'MealMixer';
}
