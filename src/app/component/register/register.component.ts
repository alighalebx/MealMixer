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

    const user: User = {
      uid: '',
      email: this.email,
      username: this.username,
      displayName: '', 
      photoURL: '' 
    };

    if (this.selectedFile) {
      const filePath = `profile_images/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            user.photoURL = url; 
            this.registerUserWithEmail(user);
          });
        })
      ).subscribe();
    } else {
      this.registerUserWithEmail(user);
    }
  }

  registerUserWithEmail(user: User) {
  
    this.auth.register(this.email, this.password, user);

    this.email = '';
    this.password = '';
    this.username = '';
    this.selectedFile = null;
    this.previewImage = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        this.previewImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
