import { createReducer, on } from '@ngrx/store';
import { FormTemplate, FormSubmission } from '../../models/form.model';
import {
  addField, updateForm, loadFormsSuccess, loadFormByIdSuccess, loadFormByIdFailure,
  saveFormSuccess, saveFormFailure, deleteFormSuccess, deleteFormFailure,
  submitFormSuccess, submitFormFailure
} from '../actions/form.actions';

export interface FormState {
  forms: FormTemplate[];
  submissions: FormSubmission[];
  currentForm: FormTemplate | null;
  submissionError: string | null;
  formError: string | null; // New state for general form errors (load/save/delete)
}

export const initialState: FormState = {
  forms: [],
  submissions: [],
  currentForm: null,
  submissionError: null,
  formError: null
};

export const formReducer = createReducer(
  initialState,
  on(addField, (state, { field }) => ({
    ...state,
    currentForm: state.currentForm
      ? { ...state.currentForm, fields: [...state.currentForm.fields, field] }
      : state.currentForm // If currentForm is null, it remains null. This should ideally not happen if a form is being built.
  })),
  on(updateForm, (state, { form }) => ({
    ...state,
    currentForm: form,
    forms: state.forms.some(f => f.id === form.id)
      ? state.forms.map(f => (f.id === form.id ? form : f))
      : [...state.forms, form] // Add new form if it doesn't exist
  })),
  on(loadFormsSuccess, (state, { forms }) => ({
    ...state,
    forms,
    formError: null // Clear any previous errors
  })),
  on(loadFormByIdSuccess, (state, { form }) => ({
    ...state,
    currentForm: form,
    formError: null // Clear any previous errors
  })),
  on(loadFormByIdFailure, (state, { error }) => ({
    ...state,
    currentForm: null,
    formError: error
  })),
  on(saveFormSuccess, (state, { form }) => ({
    ...state,
    forms: state.forms.some(f => f.id === form.id)
      ? state.forms.map(f => (f.id === form.id ? form : f))
      : [...state.forms, form],
    currentForm: form, // Ensure current form is updated after save
    formError: null
  })),
  on(saveFormFailure, (state, { error }) => ({
    ...state,
    formError: error
  })),
  on(deleteFormSuccess, (state, { id }) => ({
    ...state,
    forms: state.forms.filter(form => form.id !== id),
    formError: null
  })),
  on(deleteFormFailure, (state, { error }) => ({
    ...state,
    formError: error
  })),
  on(submitFormSuccess, (state, { submission }) => ({
    ...state,
    submissions: [...state.submissions, submission],
    submissionError: null
  })),
  on(submitFormFailure, (state, { error }) => ({
    ...state,
    submissionError: error
  }))
);