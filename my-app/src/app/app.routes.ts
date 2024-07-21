import { Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  { path: 'notes', component: NoteListComponent },
  { path: 'users', component: UserManagementComponent },
  { path: '', redirectTo: '/notes', pathMatch: 'full' }
];
