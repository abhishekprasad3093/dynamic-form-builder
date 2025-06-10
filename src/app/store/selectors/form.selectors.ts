import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { FormState } from '../reducers/form.reducer';

export const selectFormState = (state: AppState) => state.forms;

export const selectForms = createSelector(
  selectFormState,
  (state: FormState) => state.forms
);

export const selectCurrentForm = createSelector(
  selectFormState,
  (state: FormState) => state.currentForm
);

export const selectSubmissions = createSelector(
  selectFormState,
  (state: FormState) => state.submissions
);