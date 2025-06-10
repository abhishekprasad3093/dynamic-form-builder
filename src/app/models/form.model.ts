export interface FormField {
  id?: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'date' | 'radio';
  label: string;
  required: boolean;
  helpText: string;
  validations: { minLength?: number; maxLength?: number; pattern?: string };
  options?: string[];
}

export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
}

export interface FormSubmission {
  formId: string;
  data: { [key: string]: any };
  submittedAt: string;
}