import { createReducer, on } from '@ngrx/store';
import { FormTemplate, FormSubmission } from '../../models/form.model';
import { addField, updateForm, loadFormsSuccess, submitFormSuccess } from '../actions/form.actions';

export interface FormState {
  forms: FormTemplate[];
  submissions: FormSubmission[];
  currentForm: FormTemplate | null;
}

export const initialState: FormState = {
  forms: [],
  submissions: [],
  currentForm: null
};

export const formReducer = createReducer(
  initialState,
  on(addField, (state, { field }) => ({
    ...state,
    currentForm: state.currentForm
      ? { ...state.currentForm, fields: [...state.currentForm.fields, field] }
      : state.currentForm
  })),
  on(updateForm, (state, { form }) => ({
    ...state,
    currentForm: form,
    forms: state.forms.some(f => f.id === form.id)
      ? state.forms.map(f => (f.id === form.id ? form : f))
      : [...state.forms, form]
  })),
  on(loadFormsSuccess, (state, { forms }) => ({
    ...state,
    forms
  })),
  on(submitFormSuccess, (state, { submission }) => ({
    ...state,
    submissions: [...state.submissions, submission]
  }))
);