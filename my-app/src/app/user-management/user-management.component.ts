import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../user.service';
import { EventService } from '../event.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isEditorMode = false;

  constructor(private userService: UserService, private eventService: EventService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsers();

    this.eventService.editorMode$.subscribe(isEnabled => {
      this.isEditorMode = isEnabled;
    });

    this.eventService.userChanged$.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.eventService.emitUserChanged(); // Emit user changed event after deletion
      },
      error: (error: any) => {
        console.error('Error deleting user', error);
      }
    });
  }
}
