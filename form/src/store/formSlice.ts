import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfiguration, FormField, FormState } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

const initialState: FormState = {
  forms: [],
  currentForm: null,
  isLoading: false,
  error: null,
};

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loadForms: (state, action: PayloadAction<FormConfiguration[]>) => {
      state.forms = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    createForm: (state, action: PayloadAction<Omit<FormConfiguration, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newForm: FormConfiguration = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.forms.push(newForm);
      state.currentForm = newForm;
    },
    updateForm: (state, action: PayloadAction<FormConfiguration>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        if (state.currentForm?.id === action.payload.id) {
          state.currentForm = state.forms[index];
        }
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
      if (state.currentForm?.id === action.payload) {
        state.currentForm = null;
      }
    },
    setCurrentForm: (state, action: PayloadAction<FormConfiguration | null>) => {
      state.currentForm = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      if (state.currentForm) {
        const newField: FormField = {
          ...action.payload,
          id: uuidv4(),
          order: state.currentForm.fields.length,
        };
        state.currentForm.fields.push(newField);
        state.currentForm.updatedAt = new Date().toISOString();
        
        // Update the form in the forms array
        const formIndex = state.forms.findIndex(form => form.id === state.currentForm!.id);
        if (formIndex !== -1) {
          state.forms[formIndex] = state.currentForm;
        }
      }
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(field => field.id === action.payload.id);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = action.payload;
          state.currentForm.updatedAt = new Date().toISOString();
          
          // Update the form in the forms array
          const formIndex = state.forms.findIndex(form => form.id === state.currentForm!.id);
          if (formIndex !== -1) {
            state.forms[formIndex] = state.currentForm;
          }
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
        // Reorder remaining fields
        state.currentForm.fields.forEach((field, index) => {
          field.order = index;
        });
        state.currentForm.updatedAt = new Date().toISOString();
        
        // Update the form in the forms array
        const formIndex = state.forms.findIndex(form => form.id === state.currentForm!.id);
        if (formIndex !== -1) {
          state.forms[formIndex] = state.currentForm;
        }
      }
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload.map((field, index) => ({
          ...field,
          order: index,
        }));
        state.currentForm.updatedAt = new Date().toISOString();
        
        // Update the form in the forms array
        const formIndex = state.forms.findIndex(form => form.id === state.currentForm!.id);
        if (formIndex !== -1) {
          state.forms[formIndex] = state.currentForm;
        }
      }
    },
  },
});

export const {
  setLoading,
  setError,
  loadForms,
  createForm,
  updateForm,
  deleteForm,
  setCurrentForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
} = formSlice.actions;

export default formSlice.reducer;
