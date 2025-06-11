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

// New actions for loading a single form
export const loadFormById = createAction(
  '[Form] Load Form By ID',
  props<{ id: string }>()
);

export const loadFormByIdSuccess = createAction(
  '[Form] Load Form By ID Success',
  props<{ form: FormTemplate }>()
);

export const loadFormByIdFailure = createAction(
  '[Form] Load Form By ID Failure',
  props<{ error: string }>()
);

// New actions for saving form templates
export const saveForm = createAction(
  '[Form] Save Form',
  props<{ form: FormTemplate }>()
);

export const saveFormSuccess = createAction(
  '[Form] Save Form Success',
  props<{ form: FormTemplate }>()
);

export const saveFormFailure = createAction(
  '[Form] Save Form Failure',
  props<{ error: string }>()
);

// New actions for deleting form templates
export const deleteForm = createAction(
  '[Form] Delete Form',
  props<{ id: string }>()
);

export const deleteFormSuccess = createAction(
  '[Form] Delete Form Success',
  props<{ id: string }>()
);

export const deleteFormFailure = createAction(
  '[Form] Delete Form Failure',
  props<{ error: string }>()
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