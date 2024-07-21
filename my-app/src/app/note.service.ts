import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  noteNo: string;
  noteTitle: string;
  noteContents: string;
  userId: number;
  deletedAt: string;
  userName?: string; // Optional property for user name
}

export interface CreateNotePayload {
  noteTitle: string;
  noteContents: string;
  userId: number;
  deletedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:5092/api';

  constructor(private http: HttpClient) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/Note`);
  }

  addNote(payload: CreateNotePayload): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/Note`, payload);
  }

  updateNote(id: string, payload: Partial<Note>): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/Notes/${id}`, payload);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Notes/${id}`);
  }
}
