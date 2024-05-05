import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import firebase from compat

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  // Get user name by ID
  getUserNameById(userId: string): Observable<string | null> {
    return this.firestore.doc<any>(`users/${userId}`).valueChanges().pipe(
      map((user: any) => (user ? user.displayName : null))
    );
  }

  // Follow a user
  followUser(currentUserId: string, targetUserId: string): Promise<void> {
    // Update the following list of the current user
    const followingRef = this.firestore.doc(`users/${currentUserId}/following/${targetUserId}`);
    const followingData = { followedAt: new Date() };
  
    // Update the followers list of the target user
    const followerRef = this.firestore.doc(`users/${targetUserId}`);
    const followerUpdate = { followers: firebase.firestore.FieldValue.arrayUnion(currentUserId) };
  
    // Perform both updates
    return this.firestore.firestore.runTransaction(async transaction => {
      transaction.set(followingRef.ref, followingData);
      transaction.update(followerRef.ref, followerUpdate);
    });
  }

// Unfollow a user
unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
  // Update the following list of the current user
  const followingRef = this.firestore.doc(`users/${currentUserId}/following/${targetUserId}`);

  // Update the followers list of the target user
  const followerRef = this.firestore.doc(`users/${targetUserId}`);
  const followerUpdate = { followers: firebase.firestore.FieldValue.arrayRemove(currentUserId) };

  // Perform both updates
  return this.firestore.firestore.runTransaction(async transaction => {
    transaction.delete(followingRef.ref);
    transaction.update(followerRef.ref, followerUpdate);
  });
}



  // Get list of users followed by the current user
  getFollowingUsers(currentUserId: string): Observable<any[]> {
    return this.firestore.collection(`users/${currentUserId}/following`).valueChanges();
  }
}
