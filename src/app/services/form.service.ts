import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { FormTemplate } from '../models/form.model';
import { v4 as uuidv4 } from 'uuid';

const FORMS_STORAGE_KEY = 'dynamicForms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private forms: FormTemplate[] = [];

  constructor() {
    this.loadFormsFromLocalStorage();
  }

  private loadFormsFromLocalStorage() {
    try {
      const storedForms = localStorage.getItem(FORMS_STORAGE_KEY);
      if (storedForms) {
        this.forms = JSON.parse(storedForms);
      } else {
        // Initialize with a sample form if no forms are in local storage
        this.forms = [
          {
            id: uuidv4(),
            name: 'Sample Contact Form',
            fields: [
              { id: uuidv4(), type: 'text', label: 'Full Name', required: true, helpText: 'Please enter your full name.', validations: { minLength: 3, maxLength: 50 } },
              { id: uuidv4(), type: 'textarea', label: 'Message', required: false, helpText: 'Enter your message here.', validations: { maxLength: 500 } },
              { id: uuidv4(), type: 'dropdown', label: 'Inquiry Type', required: true, helpText: 'Select the type of your inquiry.', validations: {}, options: ['General', 'Support', 'Feedback'] },
              { id: uuidv4(), type: 'date', label: 'Preferred Contact Date', required: false, helpText: 'When would you like us to contact you?', validations: {} },
              { id: uuidv4(), type: 'radio', label: 'How did you hear about us?', required: true, helpText: 'Select one option.', validations: {}, options: ['Google', 'Social Media', 'Friend', 'Other'] }
            ]
          }
        ];
        this.saveFormsToLocalStorage(); // Save initial forms
      }
    } catch (e) {
      console.error('Error loading forms from local storage', e);
      // Fallback to empty array if local storage fails
      this.forms = [];
    }
  }

  private saveFormsToLocalStorage() {
    try {
      localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(this.forms));
    } catch (e) {
      console.error('Error saving forms to local storage', e);
      alert('Could not save forms to local storage. Please check your browser settings or storage space.');
    }
  }

  getForms(): Observable<FormTemplate[]> {
    return of(this.forms);
  }

  getForm(id: string): Observable<FormTemplate | undefined> {
    const form = this.forms.find(f => f.id === id);
    return of(form);
  }

  saveFormTemplate(form: FormTemplate): Observable<FormTemplate> {
    const index = this.forms.findIndex(f => f.id === form.id);
    if (index > -1) {
      this.forms[index] = form; // Update existing form
    } else {
      this.forms.push(form); // Add new form
    }
    this.saveFormsToLocalStorage();
    return of(form);
  }

  deleteFormTemplate(id: string): Observable<boolean> {
    const initialLength = this.forms.length;
    this.forms = this.forms.filter(f => f.id !== id);
    if (this.forms.length < initialLength) {
      this.saveFormsToLocalStorage();
      return of(true);
    }
    return throwError(() => new Error(`Form with ID ${id} not found.`));
  }
}