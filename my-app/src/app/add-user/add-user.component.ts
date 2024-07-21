import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService, CreateUserPayload } from '../user.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  name = '';
  email = '';
  phone = '';

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private dialogRef: MatDialogRef<AddUserComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addUser(): void {
    if (this.name.trim() && this.email.trim() && this.phone.trim()) {
      const newUser: CreateUserPayload = {
        name: this.name,
        email: this.email,
        phone: this.phone
      };

      this.userService.addUser(newUser).subscribe({
        next: (response) => {
          console.log('User added successfully', response);
          this.eventService.emitUserChanged();
          this.closeDialog(); // Close the dialog after successful addition
        },
        error: (error: any) => {
          console.error('Error adding user', error);
        }
      });
    } else {
      console.error('All fields are required');
    }
  }
}
