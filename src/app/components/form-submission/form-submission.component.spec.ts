import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmissionComponent } from './form-submission.component';

describe('FormSubmissionComponent', () => {
  let component: FormSubmissionComponent;
  let fixture: ComponentFixture<FormSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
