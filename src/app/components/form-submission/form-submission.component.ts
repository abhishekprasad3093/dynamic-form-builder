import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms'; // Added FormArray
import { Store } from '@ngrx/store';
import { selectCurrentForm } from '../../store/selectors/form.selectors';
import { submitForm, submitFormSuccess, submitFormFailure, loadFormById } from '../../store/actions/form.actions'; // Added loadFormById
import { FormTemplate, FormSubmission, FormField } from '../../models/form.model'; // Added FormField
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs/operators'; // Added take
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'app-form-submission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-submission.component.html',
  styleUrls: ['./form-submission.component.scss']
})
export class FormSubmissionComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router
  form$ = this.store.select(selectCurrentForm);
  formGroup: FormGroup = this.fb.group({});
  submissionSuccess: boolean = false;
  submissionError: string | null = null;
  currentFormTemplate: FormTemplate | null = null; // Store the form template locally

  ngOnInit() {
    this.route.paramMap.pipe(
      filter(params => params.has('id')),
      takeUntilDestroyed() // Unsubscribe when component is destroyed
    ).subscribe(params => {
      const formId = params.get('id');
      if (formId) {
        this.store.dispatch(loadFormById({ id: formId }));
      }
    });

    this.form$.pipe(
      filter(form => !!form), // Only proceed if form is not null
      takeUntilDestroyed()
    ).subscribe(form => {
      this.currentFormTemplate = form;
      this.buildForm(form);
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
      if (field.validations?.pattern) validators.push(Validators.pattern(new RegExp(field.validations.pattern))); // Use RegExp for pattern

      // Handle different field types for Reactive Forms
      if (field.type === 'checkbox' && field.options) {
        // For checkbox groups, create a FormArray of FormControls, one for each option
        const checkboxControls = field.options.map(option => this.fb.control(false)); // Default to unchecked
        group[field.id] = this.fb.array(checkboxControls, validators);
      } else if (field.type === 'radio' && field.options) {
        // For radio buttons, one control for the group
        group[field.id] = ['', validators];
      }
      else {
        group[field.id] = ['', validators];
      }
    });
    this.formGroup = this.fb.group(group);
  }

  // Helper to get form array for checkboxes
  getCheckboxControls(fieldId: string): FormArray {
    return this.formGroup.get(fieldId) as FormArray;
  }

  onSubmit() {
    this.submissionSuccess = false; // Reset messages on new submission attempt
    this.submissionError = null;

    // Manually mark all controls as touched for validation display
    this.markAllAsTouched(this.formGroup);

    if (this.formGroup.valid) {
      const formId = this.route.snapshot.paramMap.get('id');
      const formData = this.formGroup.value;

      // Special handling for checkbox values to get selected options
      if (this.currentFormTemplate) {
        this.currentFormTemplate.fields.forEach(field => {
          if (field.type === 'checkbox' && field.options && formData[field.id]) {
            const selectedOptions: string[] = [];
            (formData[field.id] as boolean[]).forEach((isChecked, index) => {
              if (isChecked) {
                selectedOptions.push(field.options![index]);
              }
            });
            formData[field.id] = selectedOptions;
          }
        });
      }

      const submission: FormSubmission = {
        formId: formId ?? 'unknown-form-id',
        data: formData,
        submittedAt: new Date().toISOString()
      };
      this.store.dispatch(submitForm({ submission }));
    } else {
      this.submissionError = 'Please correct the highlighted fields.';
    }
  }

  // Recursive function to mark all controls in a FormGroup or FormArray as touched
  private markAllAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        control.markAsTouched();
        this.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  ngOnDestroy(): void {
    // takeUntilDestroyed handles this automatically
  }
}