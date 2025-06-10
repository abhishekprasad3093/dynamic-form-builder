import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentForm } from '../../store/selectors/form.selectors'; // Removed selectSubmissions here as it's not directly used for this component's feedback
import { submitForm, submitFormSuccess, submitFormFailure } from '../../store/actions/form.actions';
import { FormTemplate, FormSubmission } from '../../models/form.model';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // For automatic unsubscription
import { filter } from 'rxjs/operators';
import { ofType } from '@ngrx/effects';


@Component({
  selector: 'app-form-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-submission.component.html',
  styleUrls: ['./form-submission.component.scss']
})
export class FormSubmissionComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  form$ = this.store.select(selectCurrentForm);
  formGroup: FormGroup = this.fb.group({});
  submissionSuccess: boolean = false;
  submissionError: string | null = null;

  ngOnInit() {
    this.form$.subscribe(form => {
      if (form) {
        this.buildForm(form);
      }
    });

    // Listen for submission success
    this.store.pipe(
      ofType(submitFormSuccess),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.submissionSuccess = true;
      this.submissionError = null;
      this.formGroup.reset();
      setTimeout(() => this.submissionSuccess = false, 3000); // Hide message after 3 seconds
    });

    // Listen for submission failure
    this.store.pipe(
      ofType(submitFormFailure),
      takeUntilDestroyed()
    ).subscribe(({ error }) => {
      this.submissionError = error;
      this.submissionSuccess = false;
      setTimeout(() => this.submissionError = null, 5000); // Hide error after 5 seconds
    });
  }

  buildForm(form: FormTemplate) {
    const group: { [key: string]: any } = {};
    form.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validations?.minLength) validators.push(Validators.minLength(field.validations.minLength));
      if (field.validations?.maxLength) validators.push(Validators.maxLength(field.validations.maxLength));
      if (field.validations?.pattern) validators.push(Validators.pattern(field.validations.pattern));
      if (field.id) {
        group[field.id] = ['', validators];
      }
    });
    this.formGroup = this.fb.group(group);
  }

  onSubmit() {
    this.submissionSuccess = false; // Reset messages on new submission attempt
    this.submissionError = null;

    if (this.formGroup.valid) {
      const formId = this.route.snapshot.paramMap.get('id');
      const submission: FormSubmission = {
        formId: formId ?? 'unknown-form-id',
        data: this.formGroup.value,
        submittedAt: new Date().toISOString()
      };
      this.store.dispatch(submitForm({ submission }));
    } else {
      this.submissionError = 'Please correct the highlighted fields.';
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to display validation messages
    }
  }
}