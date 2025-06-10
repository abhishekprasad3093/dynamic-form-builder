import { ActionReducerMap } from '@ngrx/store';
import { FormState, formReducer } from './form.reducer';

export interface AppState {
  forms: FormState;
}

export const reducers: ActionReducerMap<AppState> = {
  forms: formReducer
};