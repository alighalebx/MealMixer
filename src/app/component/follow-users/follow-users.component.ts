import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../model/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-users',
  templateUrl: './follow-users.component.html',
  styleUrls: ['./follow-users.component.css']
})
export class FollowUsersComponent implements OnInit {
  users: User[] = []; // Array to store all users except the logged-in user
  followingUserIds: Set<string> = new Set(); // Set to store IDs of users being followed

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFollowingUsers();
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser) {
        const currentUserId = currentUser.uid;
        this.userService.getAllUsers().subscribe(allUsers => {
          this.users = allUsers.filter(user => user.uid !== currentUserId);
          // Initialize the following state for each user
          this.users.forEach(user => {
            user.isFollowing = this.followingUserIds.has(user.uid);
          });
        });
      }
    });
  }
  
  navigateToUserProfile(userId: string) {
    this.router.navigate(['profile', userId]); // Navigate to user profile with userId as parameter
  }
  loadFollowingUsers() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser) {
        const currentUserId = currentUser.uid;
        this.firestore.collection(`users/${currentUserId}/following`).valueChanges({ idField: 'uid' })
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
    });
  }

  toggleFollow(user: User) {
    const currentUserId = this.authService.userId;
    if (user.isFollowing) {
      // Unfollow the user
      this.userService.unfollowUser(currentUserId, user.uid)
        .then(() => {
          user.isFollowing = false;
          this.followingUserIds.delete(user.uid);
        })
        .catch(error => {
          console.error('Error unfollowing user:', error);
        });
    } else {
      // Follow the user
      this.userService.followUser(currentUserId, user.uid)
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
