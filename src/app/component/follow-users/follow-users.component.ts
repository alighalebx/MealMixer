import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../model/user.interface';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-follow-users',
  templateUrl: './follow-users.component.html',
  styleUrls: ['./follow-users.component.css']
})
export class FollowUsersComponent implements OnInit {
  users: User[] = []; // Array to store all users except the logged-in user
  followingUserIds: Set<string> = new Set(); // Set to store IDs of users being followed
  currentUserId: string=''; // Store the current user's ID

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to the userId$ observable to get the current userId
    this.authService.userId$.pipe(take(1)).subscribe(id => {
      this.currentUserId = id;
      if (!this.currentUserId) {
        // Redirect to login page if userId is not available
        this.router.navigate(['/login']);
        return; // Stop further execution
      }
      this.loadFollowingUsers();
      this.loadAllUsers();
    });
  }

  loadAllUsers() {
    // Use the currentUserId obtained from the subscription
    this.userService.getAllUsers().subscribe(allUsers => {
      this.users = allUsers.filter(user => user.uid !== this.currentUserId);
      // Initialize the following state for each user
      this.users.forEach(user => {
        user.isFollowing = this.followingUserIds.has(user.uid);
      });
    });
  }
  
  navigateToUserProfile(userId: string) {
    this.router.navigate(['profile', userId]); // Navigate to user profile with userId as parameter
  }

  loadFollowingUsers() {
    // Use the currentUserId obtained from the subscription
    this.firestore.collection(`users/${this.currentUserId}/following`).valueChanges({ idField: 'uid' })
      .subscribe((followingUsers: any[]) => {
        // Update the set of following user IDs
        this.followingUserIds.clear();
        followingUsers.forEach(user => {
          this.followingUserIds.add(user.uid);
        });
        // Update the following state for each user
        this.users.forEach(user => {
          user.isFollowing = this.followingUserIds.has(user.uid);
        });
      });
  }

  toggleFollow(user: User) {
    // Use the currentUserId obtained from the subscription
    if (user.isFollowing) {
      // Unfollow the user
      this.userService.unfollowUser(this.currentUserId, user.uid)
        .then(() => {
          user.isFollowing = false;
          this.followingUserIds.delete(user.uid);
        })
        .catch(error => {
          console.error('Error unfollowing user:', error);
        });
    } else {
      // Follow the user
      this.userService.followUser(this.currentUserId, user.uid)
        .then(() => {
          user.isFollowing = true;
          this.followingUserIds.add(user.uid);
        })
        .catch(error => {
          console.error('Error following user:', error);
        });
    }
  }
}
