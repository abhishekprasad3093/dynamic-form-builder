import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, concatMap } from 'rxjs/operators';
import { FormService } from '../../services/form.service';
import { MockApiService } from '../../services/mock-api.service';
import {
  loadForms, loadFormsSuccess, loadFormById, loadFormByIdSuccess, loadFormByIdFailure,
  saveForm, saveFormSuccess, saveFormFailure, deleteForm, deleteFormSuccess, deleteFormFailure,
  submitForm, submitFormSuccess, submitFormFailure
} from '../actions/form.actions';
import { Router } from '@angular/router'; // Import Router for navigation

@Injectable()
export class FormEffects {
  loadForms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadForms),
      tap(() => console.log('[FormEffects] loadForms$ effect triggered')),
      mergeMap(() => {
        return this.formService.getForms().pipe(
          map(forms => loadFormsSuccess({ forms })),
          catchError(error => {
            console.error('[FormEffects] Error loading forms:', error);
            return of(loadFormByIdFailure({ error: error.message || 'Failed to load forms' })); // Reuse loadFormByIdFailure for general form loading errors
          })
        );
      })
    )
  );

  loadFormById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFormById),
      tap(action => console.log(`[FormEffects] loadFormById$ effect triggered for ID: ${action.id}`)),
      mergeMap(action =>
        this.formService.getForm(action.id).pipe(
          map(form => {
            if (form) {
              return loadFormByIdSuccess({ form });
            } else {
              console.error(`[FormEffects] Form with ID ${action.id} not found.`);
              return loadFormByIdFailure({ error: `Form with ID ${action.id} not found.` });
            }
          }),
          catchError(error => {
            console.error(`[FormEffects] Error loading form by ID ${action.id}:`, error);
            return of(loadFormByIdFailure({ error: error.message || 'Failed to load form' }));
          })
        )
      )
    )
  );

  saveForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveForm),
      tap(action => console.log(`[FormEffects] saveForm$ effect triggered for form: ${action.form.name}`)),
      concatMap(action =>
        this.formService.saveFormTemplate(action.form).pipe(
          map(form => saveFormSuccess({ form })),
          catchError(error => {
            console.error('[FormEffects] Error saving form:', error);
            return of(saveFormFailure({ error: error.message || 'Failed to save form' }));
          })
        )
      )
    )
  );

  deleteForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteForm),
      tap(action => console.log(`[FormEffects] deleteForm$ effect triggered for ID: ${action.id}`)),
      mergeMap(action =>
        this.formService.deleteFormTemplate(action.id).pipe(
          map(() => deleteFormSuccess({ id: action.id })),
          catchError(error => {
            console.error('[FormEffects] Error deleting form:', error);
            return of(deleteFormFailure({ error: error.message || 'Failed to delete form' }));
          })
        )
      )
    )
  );

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitForm),
      tap(() => console.log('[FormEffects] submitForm$ effect triggered')),
      mergeMap(({ submission }) => {
        return this.mockApiService.submitForm(submission).pipe(
          tap(() => console.log('[FormEffects] Submitting form via MockApiService')),
          map(sub => submitFormSuccess({ submission: sub })),
          catchError(error => {
            console.error('[FormEffects] Error submitting form:', error);
            return of(submitFormFailure({ error: error.message || 'Unknown submission error' }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private formService: FormService,
    private mockApiService: MockApiService,
    private router: Router
  ) {
    console.log('[FormEffects] FormEffects instantiated');
  }
}