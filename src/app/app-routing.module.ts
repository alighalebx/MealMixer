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

const routes: Routes = [
  {path: '',redirectTo:'login',pathMatch:'full'},
  {path: 'login',component: LoginComponent},
  {path: 'dashboard',component:DashboardComponent},
  {path: 'register',component:RegisterComponent},
  {path: 'varify-email', component : VerifyEmailComponent},
  {path: 'forgot-password', component : ForgotPasswordComponent},
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/create', component: RecipeCreationComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent }, // Route for viewing a single recipe by its ID



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
