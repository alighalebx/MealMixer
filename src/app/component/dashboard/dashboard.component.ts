import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router, private auth: AuthService) { }

  navigateToCreateRecipe() {
    // Navigate to the recipe creation page, passing the user ID as a query parameter
    this.router.navigate(['recipes/create'], { queryParams: { authorId: this.auth.userId } });
  }
  navigateToListRecipe() {
    // Navigate to the recipe creation page, passing the user ID as a query parameter
    this.router.navigate(['recipes'], { queryParams: { authorId: this.auth.userId } });
  }
  navigateToUserProfile() {
    this.router.navigate(['profile', this.auth.userId]); // Navigate to user profile with userId as parameter
  }
  navigateToFollowUsers() {
    // Navigate to the follow users page
    this.router.navigate(['follow-users']);
  }
  navigateToMealPlanning() {
    // Navigate to the follow users page
    this.router.navigate(['meal-planning']);
  }
  navigateToMealPlanningList() {
    // Navigate to the follow users page
    this.router.navigate(['selected-meal-planning']);
  }

  
}
