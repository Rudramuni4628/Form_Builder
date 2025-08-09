export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email';
  value?: string | number;
  message: string;
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface DerivedFieldConfig {
  parentFieldIds: string[];
  formula: string; // JavaScript expression or predefined formula type
  formulaType: 'custom' | 'age_from_dob' | 'sum' | 'average' | 'concat';
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  validationRules?: ValidationRule[];
  options?: FormFieldOption[]; // For select, radio, checkbox
  defaultValue?: string | number | boolean;
  order: number;
  isDerived?: boolean;
  derivedConfig?: DerivedFieldConfig;
}

export interface FormConfiguration {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

export interface FormState {
  forms: FormConfiguration[];
  currentForm: FormConfiguration | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  forms: FormState;
}
