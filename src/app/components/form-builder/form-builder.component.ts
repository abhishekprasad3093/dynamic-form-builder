import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { addField, updateForm } from '../../store/actions/form.actions';
import { FormField, FormTemplate } from '../../models/form.model';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { selectCurrentForm } from '../../store/selectors/form.selectors';


@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  availableFields: FormField[] = [
    { type: 'text', label: 'Text Input', required: false, helpText: '', validations: {} },
    { type: 'textarea', label: 'Multi-line Text', required: false, helpText: '', validations: {} },
    { type: 'dropdown', label: 'Dropdown', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] },
    { type: 'checkbox', label: 'Checkbox', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] },
    { type: 'date', label: 'Date Picker', required: false, helpText: '', validations: {} },
    { type: 'radio', label: 'Radio Buttons', required: false, helpText: '', validations: {}, options: ['Option 1', 'Option 2'] }
  ];

  formFields: FormField[] = [];
  formTemplate: FormTemplate = { id: uuidv4(), name: 'New Form', fields: [] };
  optionsInput: { [index: number]: string } = {}; // Temporary storage for comma-separated options

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      alert('Unauthorized access');
      return;
    }
    const formId = this.route.snapshot.paramMap.get('id');
    if (formId !== 'new') {
      this.store.select(selectCurrentForm).subscribe(form => {
        if (form) {
          this.formTemplate = form;
          this.formFields = form.fields;
          // Initialize optionsInput for existing fields and ensure validations object exists
          this.formFields.forEach((field, index) => {
            if (field.options) {
              this.optionsInput[index] = field.options.join(',');
            }
            if (!field.validations) { // Ensure validations object is present
              field.validations = {};
            }
          });
        }
      });
    }
  }

  drop(event: CdkDragDrop<FormField[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Ensure validations object is initialized for new fields
      const newField = { 
        ...event.previousContainer.data[event.previousIndex], 
        id: uuidv4(), 
        validations: event.previousContainer.data[event.previousIndex].validations || {} 
      };
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Replace the transferred item with the newField to ensure ID and validations are set
      event.container.data[event.currentIndex] = newField;
      this.store.dispatch(addField({ field: newField }));
    }
    this.updateForm();
  }

  updateField(index: number, updatedField: FormField) {
    this.formFields[index] = { ...updatedField }; // Create a new object to trigger change detection if necessary
    this.updateForm();
  }

  updateFormName(target: any) {
    this.formTemplate.name = target.value;
    this.updateForm();
  }

  updateOptions(index: number, optionsString: any) {
    this.optionsInput[index] = optionsString.value;
    const options = optionsString ? optionsString.value.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
    this.formFields[index] = { ...this.formFields[index], options };
    this.updateForm();
  }

  updateForm() {
    this.formTemplate.fields = this.formFields;
    this.store.dispatch(updateForm({ form: this.formTemplate }));
  }
}