import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  // Get user name by ID
  getUserNameById(userId: string): Observable<string | null> {
    return this.firestore.doc<any>(`users/${userId}`).valueChanges().pipe(
      map((user: any) => (user ? user.displayName : null))
    );
  }

  // Follow a user
  followUser(currentUserId: string, targetUserId: string): Promise<void> {
    return this.firestore.doc(`users/${currentUserId}`).collection('following').doc(targetUserId).set({ followedAt: new Date() });
  }

  // Unfollow a user
  unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    return this.firestore.doc(`users/${currentUserId}`).collection('following').doc(targetUserId).delete();
  }

  // Get list of users followed by the current user
  getFollowingUsers(currentUserId: string): Observable<any[]> {
    return this.firestore.collection(`users/${currentUserId}/following`).valueChanges();
  }
}
