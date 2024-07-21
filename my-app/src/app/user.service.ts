import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  noteCount: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5092/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/User`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/User/${id}`);
  }

  addUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/User`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/User/${id}`);
  }

  updateUser(id: number, payload: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/User/${id}`, payload);
  }
}
