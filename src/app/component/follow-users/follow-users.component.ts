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
  users: User[] = []; 
  followingUserIds: Set<string> = new Set(); 
  currentUserId: string='';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.userId$.pipe(take(1)).subscribe(id => {
      this.currentUserId = id;
      if (!this.currentUserId) {
        this.router.navigate(['/login']);
        return;
      }
      this.loadFollowingUsers();
      this.loadAllUsers();
    });
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe(allUsers => {
      this.users = allUsers.filter(user => user.uid !== this.currentUserId);
      this.users.forEach(user => {
        user.isFollowing = this.followingUserIds.has(user.uid);
      });
    });
  }
  
  navigateToUserProfile(userId: string) {
    this.router.navigate(['profile', userId]); // Navigate to user profile with userId as parameter
  }

  loadFollowingUsers() {
    this.firestore.collection(`users/${this.currentUserId}/following`).valueChanges({ idField: 'uid' })
      .subscribe((followingUsers: any[]) => {
        this.followingUserIds.clear();
        followingUsers.forEach(user => {
          this.followingUserIds.add(user.uid);
        });
        this.users.forEach(user => {
          user.isFollowing = this.followingUserIds.has(user.uid);
        });
      });
  }

  toggleFollow(user: User) {
    if (user.isFollowing) {
      this.userService.unfollowUser(this.currentUserId, user.uid)
        .then(() => {
          user.isFollowing = false;
          this.followingUserIds.delete(user.uid);
        })
        .catch(error => {
          console.error('Error unfollowing user:', error);
        });
    } else {
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
