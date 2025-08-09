import { Middleware } from '@reduxjs/toolkit';
import { AppState } from '../types/form';

const STORAGE_KEY = 'formBuilder_forms';

export const localStorageMiddleware: Middleware<{}, AppState> = (store) => (next) => (action: any) => {
  const result = next(action);

  // Save to localStorage after any form-related action
  if (action.type && typeof action.type === 'string' && action.type.startsWith('forms/')) {
    const state = store.getState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.forms.forms));
    } catch (error) {
      console.error('Failed to save forms to localStorage:', error);
    }
  }
  
  return result;
};

export const loadFormsFromStorage = () => {
  try {
    const storedForms = localStorage.getItem(STORAGE_KEY);
    return storedForms ? JSON.parse(storedForms) : [];
  } catch (error) {
    console.error('Failed to load forms from localStorage:', error);
    return [];
  }
};

export const clearFormsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear forms from localStorage:', error);
  }
};
