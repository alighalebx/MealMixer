import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private followedUsers: string[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    // Fetch followed users from Firestore on initialization
    this.fetchFollowedUsers().subscribe(users => {
      this.followedUsers = users;
    });
  }

  follow(userId: string): Promise<void> { // Return a promise
    if (!this.isFollowing(userId)) {
      this.followedUsers.push(userId);
      return this.updateFollowedUsersInFirestore(); // Return a promise
    }
    return Promise.resolve(); // Return a resolved promise if already following
  }

  unfollow(userId: string): Promise<void> { // Return a promise
    const index = this.followedUsers.indexOf(userId);
    if (index !== -1) {
      this.followedUsers.splice(index, 1);
      return this.updateFollowedUsersInFirestore(); // Return a promise
    }
    return Promise.resolve(); // Return a resolved promise if not following
  }

  isFollowing(userId: string): boolean {
    return this.followedUsers.includes(userId);
  }

  getFollowedUsers(): string[] {
    return this.followedUsers;
  }

  private fetchFollowedUsers(): Observable<string[]> {
    const currentUserId = this.authService.userId;
    return this.firestore.doc<any>(`users/${currentUserId}`).valueChanges().pipe(
      map(user => user ? user.following || [] : [])
    );
  }

  private updateFollowedUsersInFirestore(): Promise<void> { // Return a promise
    const currentUserId = this.authService.userId;
    return this.firestore.doc(`users/${currentUserId}`).update({ following: this.followedUsers });
  }
}
