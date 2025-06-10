import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectSubmissions } from '../../store/selectors/form.selectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-submitted-forms',
  standalone: true,
  imports: [CommonModule, JsonPipe], // JsonPipe for displaying raw JSON
  template: `
    <div class="container" *ngIf="authService.isAdmin(); else unauthorized">
      <h2>Submitted Forms Data</h2>
      <div *ngIf="(submissions$ | async)?.length === 0" class="alert alert-info">
        No forms have been submitted yet.
      </div>
      <div *ngFor="let submission of (submissions$ | async)" class="card mb-3">
        <div class="card-header">
          Form ID: {{ submission.formId }} - Submitted At: {{ submission.submittedAt | date:'medium' }}
        </div>
        <div class="card-body">
          <pre>{{ submission.data | json }}</pre>
        </div>
      </div>
    </div>
    <ng-template #unauthorized>
      <div class="alert alert-danger">Unauthorized access. Admins only.</div>
    </ng-template>
  `,
  styles: [`
    .card-header {
      font-weight: bold;
    }
    pre {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
      white-space: pre-wrap; /* Ensures long strings wrap */
    }
  `]
})
export class SubmittedFormsComponent implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);
  submissions$ = this.store.select(selectSubmissions);

  ngOnInit() {
    // Submissions are loaded and managed by the form reducer/effects
    // No specific action needed here beyond selecting from the store
  }
}