// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Router } from '@angular/router';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { User } from '../model/user.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(
//     private fireauth: AngularFireAuth,
//     private firestore: AngularFirestore,
//     private router: Router
//   ) {}

//   // Login function
//   login(email: string, password: string) {
//     this.fireauth.signInWithEmailAndPassword(email, password).then(() => {
//       this.router.navigate(['dashboard']);
//     }, err => {
//       alert("Something went wrong");
//       this.router.navigate(['login']);
//     });
//   }

//   // Register function
//   register(email: string, password: string, user: User) {
//     this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
//       // Add user data to Firestore
//       this.firestore.collection('users').doc(res.user?.uid).set(user)
//       .then(() => {
//         alert('Registration Successful');
//         this.router.navigate(['/login']);
//       })
//       .catch(err => {
//         alert(err.message);
//         this.router.navigate(['/register']);
//       });
//     }, err => {
//       alert(err.message);
//       this.router.navigate(['/register']);
//     });
//   }

//   // Sign out
//   logout() {
//     this.fireauth.signOut().then(() => {
//       this.router.navigate(['/login']);
//     }, err => {
//       alert(err.message);
//     });
//   }

// }
