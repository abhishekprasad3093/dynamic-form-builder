import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilderComponent } from './form-builder.component';
import { provideStore } from '@ngrx/store';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';
import { reducers } from '../../store/reducers';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let fixture: ComponentFixture<FormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderComponent, DragDropModule, FormsModule],
      providers: [
        AuthService,
        provideStore(reducers),
        provideRouter([])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});