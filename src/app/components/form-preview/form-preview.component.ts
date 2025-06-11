import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentForm } from '../../store/selectors/form.selectors';
import { loadFormById } from '../../store/actions/form.actions'; // Import loadFormById
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'; // Import Subject for manual unsubscription

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
  private destroy$ = new Subject<void>(); // For manual unsubscription

  ngOnInit() {
    this.route.paramMap.pipe(
      filter(params => params.has('id')),
      takeUntil(this.destroy$) // Unsubscribe when component is destroyed
    ).subscribe(params => {
      const formId = params.get('id');
      if (formId) {
        this.store.dispatch(loadFormById({ id: formId }));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}