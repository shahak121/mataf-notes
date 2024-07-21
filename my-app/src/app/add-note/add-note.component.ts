import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoteService, CreateNotePayload } from '../note.service';
import { EventService } from '../event.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent {
  username = '';
  title = '';
  content = '';
  duration = 1; // Default duration in days
  errorMessage = ''; // Error message

  constructor(
    private noteService: NoteService,
    private eventService: EventService,
    private dialogRef: MatDialogRef<AddNoteComponent>,
    private userService: UserService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  addNote(): void {
    if (this.username.trim() && this.title.trim() && this.content.trim() && this.duration > 0) {
      const currentDate = new Date();
      const deletedAtDate = new Date(currentDate);
      deletedAtDate.setDate(currentDate.getDate() + this.duration);

      // Fetch user by username
      this.userService.getUsers().subscribe(users => {
        const user = users.find(u => u.name === this.username.trim());
        if (user) {
          const newNote: CreateNotePayload = {
            noteTitle: this.title,
            noteContents: this.content,
            userId: user.id,
            deletedAt: deletedAtDate.toISOString()
          };

          this.noteService.addNote(newNote).subscribe({
            next: (response) => {
              console.log('Note added successfully', response);
              this.eventService.emitNoteAdded();
              this.closeDialog(); // Close the dialog after successful addition
            },
            error: (error: any) => {
              console.error('Error adding note', error);
              this.errorMessage = 'Error adding note';
            }
          });
        } else {
          console.error('User not found');
          this.errorMessage = 'User not found';
        }
      });
    } else {
      console.error('All fields are required and duration must be at least 1 day');
      this.errorMessage = 'All fields are required and duration must be at least 1 day';
    }
  }
}
