import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditorModeDialogComponent } from './editor-mode-dialog/editor-mode-dialog.component';
import { EventService } from './event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    EditorModeDialogComponent // Ensure this is imported correctly
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  isSidebarClosed = false;
  isEditorMode = false;

  constructor(public dialog: MatDialog, private eventService: EventService) {}

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  openEditorModeDialog(): void {
    const dialogRef = this.dialog.open(EditorModeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isEditorMode = true;
        this.eventService.toggleEditorMode(true);
        console.log('Editor mode enabled');
      }
    });
  }

  closeEditorMode(): void {
    this.isEditorMode = false;
    this.eventService.toggleEditorMode(false);
    console.log('Editor mode disabled');
  }
}
