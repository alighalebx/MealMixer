import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { RecipeListComponent } from './component/recipe-list/recipe-list.component';
import { RecipeCreationComponent } from './component/recipe-creation/recipe-creation.component';
import { RecipeDetailsComponent } from './component/recipe-details/recipe-details.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { FollowUsersComponent } from './component/follow-users/follow-users.component';
import { MealPlanningComponent } from './component/meal-planning/meal-planning.component';
import { MealPlanListComponent } from './component/meal-plan-list/meal-plan-list.component';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  {path: '',redirectTo:'login',pathMatch:'full'},
  {path: 'login',component: LoginComponent},
  {path: 'dashboard',component:DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'register',component:RegisterComponent},
  {path: 'varify-email', component : VerifyEmailComponent},
  {path: 'forgot-password', component : ForgotPasswordComponent},
  { path: 'recipes', component: RecipeListComponent, canActivate: [AuthGuardService] },
  { path: 'recipes/create', component: RecipeCreationComponent, canActivate: [AuthGuardService] },
  { path: 'recipes/:id', component: RecipeDetailsComponent, canActivate: [AuthGuardService] }, // Route for viewing a single recipe by its ID
  { path: 'profile/:userId', component: UserProfileComponent, canActivate: [AuthGuardService] },
  { path: 'follow-users', component: FollowUsersComponent, canActivate: [AuthGuardService] },
  { path: 'meal-planning', component: MealPlanningComponent, canActivate: [AuthGuardService]},
  { path: 'selected-meal-planning', component: MealPlanListComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
