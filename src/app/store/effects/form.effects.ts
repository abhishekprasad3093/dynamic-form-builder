import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { FormService } from '../../services/form.service';
import { MockApiService } from '../../services/mock-api.service';
import { loadForms, loadFormsSuccess, submitForm, submitFormSuccess, submitFormFailure } from '../actions/form.actions';

@Injectable()
export class FormEffects {
  loadForms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadForms),
      tap(() => console.log('[FormEffects] loadForms$ effect triggered')),
      mergeMap(() => {
        if (!this.formService) {
          console.error('[FormEffects] FormService is undefined');
          return of({ type: '[Form] Load Forms Failure', error: 'FormService not injected' });
        }
        const formsObservable = this.formService.getForms();
        if (!formsObservable || typeof formsObservable.pipe !== 'function') {
          console.error('[FormEffects] FormService.getForms returned invalid observable:', formsObservable);
          return of({ type: '[Form] Load Forms Failure', error: 'Invalid forms observable' });
        }
        return formsObservable.pipe(
          tap(() => console.log('[FormEffects] Loading forms from FormService')),
          map(forms => loadFormsSuccess({ forms })),
          catchError(error => {
            console.error('[FormEffects] Error loading forms:', error);
            return of({ type: '[Form] Load Forms Failure', error: error.message });
          })
        );
      })
    )
  );

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitForm),
      tap(() => console.log('[FormEffects] submitForm$ effect triggered')),
      mergeMap(({ submission }) => {
        if (!this.mockApiService) {
          console.error('[FormEffects] MockApiService is undefined');
          return of(submitFormFailure({ error: 'MockApiService not injected' }));
        }
        const submitObservable = this.mockApiService.submitForm(submission);
        if (!submitObservable || typeof submitObservable.pipe !== 'function') {
          console.error('[FormEffects] MockApiService.submitForm returned invalid observable:', submitObservable);
          return of(submitFormFailure({ error: 'Invalid submit observable' }));
        }
        return submitObservable.pipe(
          tap(() => console.log('[FormEffects] Submitting form via MockApiService')),
          map(sub => submitFormSuccess({ submission: sub })),
          catchError(error => {
            console.error('[FormEffects] Error submitting form:', error);
            return of(submitFormFailure({ error: error.message }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private formService: FormService,
    private mockApiService: MockApiService
  ) {
    console.log('[FormEffects] FormEffects instantiated');
    console.log('[FormEffects] FormService injected:', !!this.formService);
    console.log('[FormEffects] MockApiService injected:', !!this.mockApiService);
  }
} 