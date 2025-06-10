import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormTemplate } from '../models/form.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private forms: FormTemplate[] = [
    { id: uuidv4(), name: 'Sample Form', fields: [
      { id: uuidv4(), type: 'text', label: 'Name', required: true, helpText: 'Enter your name', validations: { minLength: 3 } }
    ] }
  ];

  getForms(): Observable<FormTemplate[]> {
    return of(this.forms);
  }

  getForm(id: string): Observable<FormTemplate> {
    const form = this.forms.find(f => f.id === id);
    if (!form) {
      throw new Error(`Form with id ${id} not found`);
    }
    return of(form);
  }
}