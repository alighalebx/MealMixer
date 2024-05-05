import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private followingState = new Map<string, boolean>();

  constructor() { }

  // Set the following state for a user
  setFollowingState(userId: string, isFollowing: boolean) {
    this.followingState.set(userId, isFollowing);
  }

  // Get the following state for a user
  getFollowingState(userId: string): boolean {
    return this.followingState.get(userId) || false;
  }
}
