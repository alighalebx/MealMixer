export interface User {
    uid: string;
    email: string;
    username: string;
    displayName?: string;
    photoURL?: string;
    followers?: string[]; // Array of user IDs who are following this user
    following?: string[]; // Array of user IDs whom this user is following
    isFollowing?: boolean; // New property to track follow state

  }
