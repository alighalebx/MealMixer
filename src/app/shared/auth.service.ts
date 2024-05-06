import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../model/user.interface';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: string = '';

  constructor(
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}


  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      // Store the user ID after successful login
      if (userCredential.user) {
        this.userId = userCredential.user.uid;
      }
      // Update userId immediately after successful login
      this.userId = userCredential.user?.uid || '';
      this.router.navigate(['dashboard']);
    }, err => {
      alert("Something went wrong");
      this.router.navigate(['login']);
    });
  }
  
  // Register function
  register(email: string, password: string, user: User) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      if (res.user) {
        // Set additional user data
        const userData = { 
          ...user,
          uid: res.user.uid,
          displayName: user.username, // Set displayName to the username provided by the user
          photoURL: user.photoURL // Set photoURL to a default value or null
        };
  
        // Add user data to Firestore
        this.firestore.collection('users').doc(res.user.uid).set(userData)
        .then(() => {
          alert('Registration Successful');
          this.router.navigate(['/login']);
        })
        .catch(err => {
          alert(err.message);
          this.router.navigate(['/register']);
        });
      } else {
        console.error('User creation failed: User object is null.');
        // Handle the case where res.user is null
      }
    }).catch(err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }
  
  // Sign out
  logout() {
    this.fireauth.signOut().then(() => {
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    });
  }


  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']); // Redirect to email verification page
    }).catch(err => {
      console.error('Error sending password reset email:', err);
      alert('Something went wrong');
    });
  }
  getCurrentUser(): Observable<any> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          // Return an Observable that emits null when user is not logged in
          return of(null);
        }
      })
    );
  }
}
