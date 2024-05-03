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
}
