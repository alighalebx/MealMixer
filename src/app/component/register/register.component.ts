import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../model/user.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(private auth: AuthService, private storage: AngularFireStorage) { }

  register() {
    // Validate form fields
    if (this.email === '' || this.password === '' || this.username === '') {
      alert('Please fill in all fields');
      return;
    }

    // Prepare user object
    const user: User = {
      uid: '',
      email: this.email,
      username: this.username,
      displayName: '', 
      photoURL: '' // Leave it empty for now, will be updated after uploading the image
    };

    // Upload image to Firebase Cloud Storage
    if (this.selectedFile) {
      const filePath = `profile_images/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            user.photoURL = url; // Update the user object with the image URL
            this.registerUserWithEmail(user);
          });
        })
      ).subscribe();
    } else {
      // If no image selected, register user directly
      this.registerUserWithEmail(user);
    }
  }

  registerUserWithEmail(user: User) {
    // Register user
    this.auth.register(this.email, this.password, user);

    // Clear form fields after registration
    this.email = '';
    this.password = '';
    this.username = '';
    this.selectedFile = null;
    this.previewImage = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    // Display preview of selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        this.previewImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
