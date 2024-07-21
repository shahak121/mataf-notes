import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorModeDialogComponent } from './editor-mode-dialog.component';

describe('EditorModeDialogComponent', () => {
  let component: EditorModeDialogComponent;
  let fixture: ComponentFixture<EditorModeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorModeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorModeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
