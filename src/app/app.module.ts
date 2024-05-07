import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {AngularFireModule} from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {firebase} from '../environments/firebase';
import {environment} from '../environments/environment';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { RecipeListComponent } from './component/recipe-list/recipe-list.component';
import { RecipeCreationComponent } from './component/recipe-creation/recipe-creation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeDetailsComponent } from './component/recipe-details/recipe-details.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { FollowUsersComponent } from './component/follow-users/follow-users.component';
import { MealPlanningComponent } from './component/meal-planning/meal-planning.component';
import { MealSelectionComponent } from './component/meal-selection/meal-selection.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MealPlanListComponent } from './component/meal-plan-list/meal-plan-list.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    RecipeListComponent,
    RecipeCreationComponent,
    RecipeDetailsComponent,
    UserProfileComponent,
    FollowUsersComponent,
    MealPlanningComponent,
    MealSelectionComponent,
    MealPlanListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSnackBarModule,
    BrowserAnimationsModule
    
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
