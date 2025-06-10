import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentForm } from '../../store/selectors/form.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  form$ = this.store.select(selectCurrentForm);

  ngOnInit() {
    const formId = this.route.snapshot.paramMap.get('id');
    // Form loaded via NgRx
  }
}