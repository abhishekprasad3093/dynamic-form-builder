import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop'; // Removed transferArrayItem as it's not used directly for copying
import { Store } from '@ngrx/store';
import { addField, updateForm, saveForm, loadFormById, deleteForm } from '../../store/actions/form.actions';
import { FormField, FormTemplate } from '../../models/form.model';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectCurrentForm } from '../../store/selectors/form.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  availableFields: FormField[] = [
    { id: 'text-palette', type: 'text', label: 'Text Input', required: false, helpText: '', validations: {} },
    { id: 'textarea-palette', type: 'textarea', label: 'Multi-line Text', required: false, helpText: '', validations: {} },
    { id: 'dropdown-palette', type: 'dropdown', label: 'Dropdown', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] },
    { id: 'checkbox-palette', type: 'checkbox', label: 'Checkbox Group', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] },
    { id: 'date-palette', type: 'date', label: 'Date Picker', required: false, helpText: '', validations: {} },
    { id: 'radio-palette', type: 'radio', label: 'Radio Button Group', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] }
  ];

  formFields: FormField[] = [];
  formTemplate: FormTemplate = { id: uuidv4(), name: 'New Form', fields: [] };
  optionsInput: { [key: string]: string } = {}; // Temporary storage for comma-separated options, using string keys for IDs

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      alert('Unauthorized access');
      // this.router.navigate(['/login']); // Optionally redirect
      return;
    }

    const formId = this.route.snapshot.paramMap.get('id');
    if (formId && formId !== 'new') {
      this.store.dispatch(loadFormById({ id: formId }));
      this.store.select(selectCurrentForm).pipe(
        filter(form => !!form && form.id === formId), // Ensure we only react to the relevant form
        takeUntilDestroyed() // Automatically unsubscribe when component is destroyed
      ).subscribe(form => {
        if (form) {
          this.formTemplate = { ...form }; // Create a copy to avoid direct mutation of store object
          this.formFields = form.fields.map(field => {
            if (!field.validations) { // Ensure validations object is present
              field.validations = {};
            }
            if (field.options) {
              this.optionsInput[field.id] = field.options.join(','); // Use field.id as key for optionsInput
            }
            return { ...field }; // Return a copy of each field
          });
        }
      });
    } else {
      // For a new form, initialize a new formTemplate with a unique ID
      this.formTemplate = { id: uuidv4(), name: 'New Form', fields: [] };
      this.formFields = []; // Ensure formFields is empty for a new form
      // No need to dispatch updateForm here, it will be dispatched on first field add or name change
    }
  }

  // Handle drop event for drag-and-drop functionality
  drop(event: CdkDragDrop<FormField[]>) {
    // If dropping within the same list (reordering fields on the canvas)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateFormAndSave();
    } else if (event.previousContainer.id === 'availableFields' && event.container.id === 'formCanvas') {
      // If dragging from the available fields palette to the form canvas
      const copiedField: FormField = {
        ...event.previousContainer.data[event.previousIndex],
        id: uuidv4(), // Assign a unique ID for the new field instance
        validations: { ...event.previousContainer.data[event.previousIndex].validations }, // Deep copy validations
        options: event.previousContainer.data[event.previousIndex].options ? [...event.previousContainer.data[event.previousIndex].options!] : undefined // Deep copy options
      };
      this.formFields.splice(event.currentIndex, 0, copiedField); // Insert the copied field at the dropped index
      // Initialize optionsInput for the new field using its unique ID
      this.optionsInput[copiedField.id] = copiedField.options ? copiedField.options.join(',') : '';
      this.updateFormAndSave();
    }
  }

  // Called when dropping from available fields (palette) to form canvas
  copyField(event: CdkDragDrop<FormField[]>) {
    const copiedField: FormField = {
      ...event.previousContainer.data[event.previousIndex],
      id: uuidv4(), // Assign a unique ID for the new field instance
      validations: { ...event.previousContainer.data[event.previousIndex].validations }, // Deep copy validations
      options: event.previousContainer.data[event.previousIndex].options ? [...event.previousContainer.data[event.previousIndex].options!] : undefined // Deep copy options
    };
    this.formFields.splice(event.currentIndex, 0, copiedField); // Insert the copied field at the dropped index
    this.optionsInput[copiedField.id] = copiedField.options ? copiedField.options.join(',') : ''; // Initialize optionsInput for the new field
    this.updateFormAndSave();
  }


  updateField(index: number) {
    // The ngModel already directly updates the properties. Just need to trigger save.
    // Ensure validations object exists before attempting to access its properties.
    if (!this.formFields[index].validations) {
        this.formFields[index].validations = {};
    }
    this.updateFormAndSave();
  }

  updateFormName(event: Event) {
    this.formTemplate.name = (event.target as HTMLInputElement).value;
    this.updateFormAndSave();
  }

  updateOptions(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const fieldId = this.formFields[index].id; // Get the unique ID of the field
    this.optionsInput[fieldId] = value;
    const options = value ? value.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
    this.formFields[index] = { ...this.formFields[index], options };
    this.updateFormAndSave();
  }

  deleteField(index: number) {
    const deletedFieldId = this.formFields[index].id;
    this.formFields.splice(index, 1);
    delete this.optionsInput[deletedFieldId]; // Remove from temporary options storage using its ID
    this.updateFormAndSave();
  }

  saveCurrentForm() {
    if (!this.formTemplate.name.trim()) {
        alert('Form name cannot be empty.');
        return;
    }
    if (this.formFields.length === 0) {
        alert('Form must contain at least one field.');
        return;
    }
    // Dispatch saveForm action to persist the current formTemplate
    this.store.dispatch(saveForm({ form: this.formTemplate }));
    alert('Form saved successfully!'); // Basic user feedback
    this.router.navigate(['/forms']); // Navigate back to form list
  }

  deleteCurrentForm() {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      this.store.dispatch(deleteForm({ id: this.formTemplate.id }));
      alert('Form deleted successfully!');
      this.router.navigate(['/forms']); // Navigate back to form list
    }
  }

  // Helper to dispatch updateForm and then saveForm
  private updateFormAndSave() {
    this.formTemplate.fields = this.formFields; // Ensure formTemplate.fields is up-to-date
    this.store.dispatch(updateForm({ form: this.formTemplate })); // Update current form in store
    // Add a debounce or throttle if this is called very frequently to avoid excessive saves
    this.store.dispatch(saveForm({ form: this.formTemplate })); // Persist to local storage
  }

  ngOnDestroy(): void {
    // takeUntilDestroyed handles subscriptions automatically
  }
}