import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../model/recipe.interface';
import { RecipeService } from '../../shared/recipe.service';
import { UserService } from '../../shared/user.service';
import { Comment } from '../../model/comment.interface'; // Import Comment interface
import { AuthService } from '../../shared/auth.service';
import { User } from '../../model/user.interface'; // Import User interface
import { Timestamp } from 'firebase/firestore'; // Import Timestamp from Firestore

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipeId: string | undefined;
  recipe: Recipe | undefined;
  authorName: string | null = null;
  comments: Comment[] = []; 
  newComment: string = ''; 
  users: { [key: string]: User } = {}; 
  selectedRating: number = 0;
  ratingOptions: number[] = [1, 2, 3, 4, 5];
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService,
    private authService: AuthService


  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipeId = id;
        this.fetchRecipeDetails();
      } else {
        console.error('Recipe ID is null');
      }
    });
  }

  fetchRecipeDetails(): void {
    this.recipeService.getRecipeById(this.recipeId!).subscribe(recipe => {
      this.recipe = recipe;
      if (recipe) {
        this.userService.getUserNameById(recipe.authorId).subscribe(name => {
          this.authorName = name;
        });
        this.fetchComments();
      }
    });
  }

  fetchComments(): void {
    this.recipeService.getCommentsForRecipe(this.recipeId!).subscribe(comments => {
      this.comments = comments.map(comment => {
        // Convert Timestamp to Date if necessary
        const createdAt = comment.createdAt instanceof Timestamp
          ? comment.createdAt.toDate()
          : comment.createdAt;
        return {
          ...comment,
          createdAt: createdAt
        };
      });
      this.fetchUsersForComments();
    });
  }
  
  fetchUsersForComments(): void {
    this.comments.forEach(comment => {
      this.userService.getUserById(comment.userId).subscribe(user => {
        if (user) {
          this.users[comment.userId] = user;
        }
      });
    });
  }

  // Method to submit a new comment
  submitComment(): void {
    if (this.newComment.trim() !== '') {
      // Check if the user is logged in or not
      // If logged in, add the comment
      // If not logged in, redirect to the login page or display a message
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid; // Use the actual user ID obtained from the AuthService
          this.recipeService.commentOnRecipe(this.recipeId!, this.newComment, userId).then(() => {
            // Clear the new comment text field
            this.newComment = '';
            // Refresh comments
            this.recipeService.getCommentsForRecipe(this.recipeId!).subscribe(comments => {
              this.comments = comments;
            });
          }).catch(error => {
            console.error('Error adding comment:', error);
          });
        } else {
          
          console.log('User is not logged in. Redirecting to login page...');
        }
      });
    }
  }

  submitRating(): void {
    if (this.selectedRating > 0 && this.recipeId) {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const userId = user.uid;
          this.recipeService.addRatingToRecipe(this.recipeId!, userId, this.selectedRating).then(() => {
            console.log('Rating submitted successfully');
            // Optionally, refresh the recipe details to show the updated average rating
          }).catch(error => {
            console.error('Error submitting rating:', error);
          });
        } else {
          console.log('User is not logged in. Redirecting to login page...');
        }
      });
    }
  }
}


