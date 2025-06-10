import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentForm } from '../../store/selectors/form.selectors';
import { submitForm } from '../../store/actions/form.actions';
import { FormTemplate, FormSubmission } from '../../models/form.model';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    this.form$.subscribe(form => {
      if (form) {
        this.buildForm(form);
      }
    });
  }

  buildForm(form: FormTemplate) {
    const group: { [key: string]: [string, Validators[]] } = {};
    form.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validations.minLength) validators.push(Validators.minLength(field.validations.minLength));
      if (field.validations.maxLength) validators.push(Validators.maxLength(field.validations.maxLength));
      if (field.validations.pattern) validators.push(Validators.pattern(field.validations.pattern));
      if (field.id) {
        group[field.id] = ['', validators];
      }
    });
    this.formGroup = this.fb.group(group);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formId = this.route.snapshot.paramMap.get('id');
      const submission: FormSubmission = {
        formId: formId ?? 'unknown-form-id',
        data: this.formGroup.value,
        submittedAt: new Date().toISOString()
      };
      this.store.dispatch(submitForm({ submission }));
    }
  }
}