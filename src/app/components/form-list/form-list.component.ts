import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadForms } from '../../store/actions/form.actions';
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
}