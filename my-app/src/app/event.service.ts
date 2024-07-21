import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private noteAddedSource = new Subject<void>();
  private userChangedSource = new Subject<void>();

  noteAdded$ = this.noteAddedSource.asObservable();
  userChanged$ = this.userChangedSource.asObservable();

  emitNoteAdded() {
    this.noteAddedSource.next();
  }

  emitUserChanged() {
    this.userChangedSource.next();
  }

  private editorModeSubject = new BehaviorSubject<boolean>(false);
  editorMode$: Observable<boolean> = this.editorModeSubject.asObservable();

  toggleEditorMode(isEnabled: boolean): void {
    this.editorModeSubject.next(isEnabled);
  }
}
