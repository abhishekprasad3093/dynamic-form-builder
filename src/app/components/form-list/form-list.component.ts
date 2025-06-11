import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadForms, deleteForm } from '../../store/actions/form.actions'; // Added deleteForm action
import { selectForms } from '../../store/selectors/form.selectors';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);
  forms$ = this.store.select(selectForms);

  ngOnInit() {
    this.store.dispatch(loadForms());
  }

  deleteForm(formId: string) {
    if (confirm('Are you sure you want to delete this form template?')) {
      this.store.dispatch(deleteForm({ id: formId }));
    }
  }
}