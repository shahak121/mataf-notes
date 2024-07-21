import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editor-mode-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Enter Password</h2>
    <mat-dialog-content>
      <form (ngSubmit)="checkPassword()" #passwordForm="ngForm">
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput type="password" [(ngModel)]="password" name="password" required>
        </mat-form-field>
        <mat-dialog-actions>
          <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
          <button mat-button type="submit" [disabled]="!passwordForm.valid">Submit</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `,
  styles: []
})
export class EditorModeDialogComponent {
  password: string = '';

  constructor(public dialogRef: MatDialogRef<EditorModeDialogComponent>) {}

  checkPassword(): void {
    if (this.password === '1234') {
      this.dialogRef.close(true);
    } else {
      alert('Incorrect password');
    }
  }
}
