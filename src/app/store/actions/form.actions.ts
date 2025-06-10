import { createAction, props } from '@ngrx/store';
import { FormField, FormTemplate, FormSubmission } from '../../models/form.model';

export const addField = createAction(
  '[Form] Add Field',
  props<{ field: FormField }>()
);

export const updateForm = createAction(
  '[Form] Update Form',
  props<{ form: FormTemplate }>()
);

export const loadForms = createAction('[Form] Load Forms');

export const loadFormsSuccess = createAction(
  '[Form] Load Forms Success',
  props<{ forms: FormTemplate[] }>()
);

export const submitForm = createAction(
  '[Form] Submit Form',
  props<{ submission: FormSubmission }>()
);

export const submitFormSuccess = createAction(
  '[Form] Submit Form Success',
  props<{ submission: FormSubmission }>()
);

export const submitFormFailure = createAction(
  '[Form] Submit Form Failure',
  props<{ error: string }>()
);