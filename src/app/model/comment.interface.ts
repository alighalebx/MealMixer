import { Timestamp } from 'firebase/firestore'; // Make sure to import Timestamp

export interface Comment {
    userId: string;
    recipeId: string;
    comment: string;
    createdAt: Date | Timestamp;
    userName?: string; // Add userName property
    userProfilePic?: string; // Add userProfilePic property
  }
  