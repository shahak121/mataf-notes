import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoteService, Note } from '../note.service';
import { MatDialog } from '@angular/material/dialog';
import { EditNoteComponent } from '../edit-note/edit-note.component';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Input() isEditorMode = false;

  constructor(private noteService: NoteService, private dialog: MatDialog) {}

  editNote(): void {
    const dialogRef = this.dialog.open(EditNoteComponent, {
      data: { note: this.note }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.noteService.updateNote(this.note.noteNo, result).subscribe({
          next: () => {
            // Handle successful update
            console.log('Note updated successfully');
          },
          error: (error: any) => {
            console.error('Error updating note', error);
          }
        });
      }
    });
  }

  deleteNote(): void {
    if (confirm(`Are you sure you want to delete the note "${this.note.noteTitle}"?`)) {
      this.noteService.deleteNote(this.note.noteNo).subscribe({
        next: () => {
          console.log('Note deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting note', error);
        }
      });
    }
  }
}
