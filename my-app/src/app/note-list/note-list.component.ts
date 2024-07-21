import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoteService, Note } from '../note.service';
import { EventService } from '../event.service';
import { NoteCardComponent } from '../note-card/note-card.component';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteComponent } from '../add-note/add-note.component';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { UserService } from '../user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NoteCardComponent, MatIconModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];
  isEditorMode = false;

  constructor(private noteService: NoteService, private eventService: EventService, private dialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.loadNotes();

    this.eventService.noteAdded$.subscribe(() => {
      this.loadNotes();
    });

    this.eventService.editorMode$.subscribe(isEnabled => {
      this.isEditorMode = isEnabled;
    });
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.notes.forEach(note => {
          this.userService.getUser(note.userId).subscribe(user => {
            note['userName'] = user.name; // Add userName property to note
          });
        });
      },
      error: (error: any) => {
        console.error('Error fetching notes', error);
      }
    });
  }

  openAddNoteDialog(): void {
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNotes();
      }
    });
  }

  openEditNoteDialog(note: Note): void {
    const dialogRef = this.dialog.open(EditNoteComponent, {
      width: '400px',
      data: note
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNotes();
      }
    });
  }

  deleteNote(note: Note): void {
    if (confirm(`Are you sure you want to delete the note "${note.noteTitle}"?`)) {
      this.noteService.deleteNote(note.noteNo).subscribe({
        next: () => {
          this.loadNotes(); // Refresh notes after deletion
        },
        error: (error: any) => {
          console.error('Error deleting note', error);
        }
      });
    }
  }
}
