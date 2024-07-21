import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService, User } from '../user.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  name: string;
  phone: string;
  email: string;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.name = data.name ?? '';  // Ensure the properties are defined
    this.phone = data.phone ?? '';
    this.email = data.email ?? '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateUser(): void {
    if (this.name.trim() && this.phone.trim()) {
      const updatedUser = {
        name: this.name,
        phone: this.phone
      };

      this.userService.updateUser(this.data.id, updatedUser).subscribe({
        next: () => {
          this.eventService.emitUserChanged();
          this.closeDialog(); // Close the dialog after successful update
        },
        error: (error: any) => {
          console.error('Error updating user', error);
        }
      });
    } else {
      console.error('All fields are required');
    }
  }
}
