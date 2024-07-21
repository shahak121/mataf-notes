import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoteService, Note } from '../note.service';
import { UserService, User } from '../user.service';
import { EventService } from '../event.service';

@Component({
  selector: 'app-edit-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.css']
})
export class EditNoteComponent implements OnInit {
  noteTitle: string;
  noteContents: string;
  username: string = ''; // Initialize as empty string
  duration: number; // Duration in days
  errorMessage = ''; // Error message

  constructor(
    private noteService: NoteService,
    private userService: UserService,
    private eventService: EventService,
    private dialogRef: MatDialogRef<EditNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note
  ) {
    this.noteTitle = data.noteTitle;
    this.noteContents = data.noteContents;
    this.duration = this.calculateDuration(data.deletedAt); // Calculate initial duration based on deletedAt date
    console.log('EditNoteComponent initialized with data:', data);
  }

  ngOnInit(): void {
    console.log('ngOnInit - Fetching user by userId:', this.data.userId);
    // Fetch user by userId to get the username
    this.userService.getUser(this.data.userId).subscribe({
      next: (user) => {
        console.log('User fetched successfully:', user);
        this.username = user.name;
      },
      error: (error) => {
        console.error('Error fetching user', error);
        this.errorMessage = 'Error fetching user';
        // Populate username with placeholder if user fetch fails
        this.username = 'Unknown User';
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  calculateDuration(deletedAt: string): number {
    const currentDate = new Date();
    const deletedAtDate = new Date(deletedAt);
    const timeDiff = deletedAtDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

    updateNote(): void {
    console.log('updateNote - Form data:', {
      username: this.username,
      noteTitle: this.noteTitle,
      noteContents: this.noteContents,
      duration: this.duration
    });

    if (this.username.trim() && this.noteTitle.trim() && this.noteContents.trim() && this.duration > 0) {
      const currentDate = new Date();
      const deletedAtDate = new Date(currentDate);
      deletedAtDate.setDate(currentDate.getDate() + this.duration);

      console.log('updateNote - Calculated deletedAtDate:', deletedAtDate.toISOString());

      this.userService.getUsers().subscribe(users => {
        const user = users.find(u => u.name === this.username.trim());
        if (user) {
          const updatedNote = {
            noteTitle: this.noteTitle,
            noteContents: this.noteContents,
            deletedAt: deletedAtDate.toISOString(),
            userId: user.id
          };

          console.log('updateNote - Updated note data:', updatedNote);

          this.noteService.updateNote(this.data.noteNo, updatedNote).subscribe({
            next: (response) => {
              console.log('Note updated successfully', response);
              this.eventService.emitNoteAdded(); // Or create a separate event for note updated
              this.closeDialog(); // Close the dialog after successful update
            },
            error: (error: any) => {
              console.error('Error updating note', error);
              this.errorMessage = 'Error updating note';
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
