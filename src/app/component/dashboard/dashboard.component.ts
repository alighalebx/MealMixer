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
}
