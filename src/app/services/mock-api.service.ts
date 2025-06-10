import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormSubmission } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private submissions: FormSubmission[] = [];

  submitForm(submission: FormSubmission): Observable<FormSubmission> {
    if (!submission.data) {
      return throwError(() => new Error('Invalid submission')).pipe(delay(500));
    }
    this.submissions.push(submission);
    return of(submission).pipe(delay(500));
  }

  getSubmissions(): Observable<FormSubmission[]> {
    return of(this.submissions).pipe(delay(500));
  }
}