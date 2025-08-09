import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateField } from '../../store/formSlice';
import { FormField, FormFieldOption, ValidationRule, DerivedFieldConfig } from '../../types/form';

interface FormFieldEditorProps {
  field: FormField;
  onClose: () => void;
}

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({ field, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.forms);
  const [editedField, setEditedField] = useState<FormField>(field);

  useEffect(() => {
    setEditedField(field);
  }, [field]);

  const handleSave = () => {
    dispatch(updateField(editedField));
    onClose();
  };

  const handleFieldChange = (property: keyof FormField, value: any) => {
    setEditedField(prev => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleAddOption = () => {
    const newOption: FormFieldOption = {
      label: `Option ${(editedField.options?.length || 0) + 1}`,
      value: `option${(editedField.options?.length || 0) + 1}`,
    };
    
    setEditedField(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption],
    }));
  };

  const handleUpdateOption = (index: number, property: keyof FormFieldOption, value: string) => {
    if (!editedField.options) return;
    
    const updatedOptions = [...editedField.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [property]: value,
    };
    
    setEditedField(prev => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleDeleteOption = (index: number) => {
    if (!editedField.options) return;
    
    const updatedOptions = editedField.options.filter((_, i) => i !== index);
    setEditedField(prev => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleAddValidationRule = () => {
    const newRule: ValidationRule = {
      type: 'required',
      message: 'This field is required',
    };
    
    setEditedField(prev => ({
      ...prev,
      validationRules: [...(prev.validationRules || []), newRule],
    }));
  };

  const handleUpdateValidationRule = (index: number, property: keyof ValidationRule, value: any) => {
    if (!editedField.validationRules) return;
    
    const updatedRules = [...editedField.validationRules];
    updatedRules[index] = {
      ...updatedRules[index],
      [property]: value,
    };
    
    setEditedField(prev => ({
      ...prev,
      validationRules: updatedRules,
    }));
  };

  const handleDeleteValidationRule = (index: number) => {
    if (!editedField.validationRules) return;

    const updatedRules = editedField.validationRules.filter((_, i) => i !== index);
    setEditedField(prev => ({
      ...prev,
      validationRules: updatedRules,
    }));
  };

  const handleDerivedFieldToggle = (isDerived: boolean) => {
    setEditedField(prev => ({
      ...prev,
      isDerived,
      derivedConfig: isDerived ? {
        parentFieldIds: [],
        formula: '',
        formulaType: 'custom'
      } : undefined,
    }));
  };

  const handleDerivedConfigChange = (config: Partial<DerivedFieldConfig>) => {
    if (!editedField.derivedConfig) return;

    setEditedField(prev => ({
      ...prev,
      derivedConfig: {
        ...prev.derivedConfig!,
        ...config,
      },
    }));
  };

  const getAvailableParentFields = () => {
    if (!currentForm) return [];
    return currentForm.fields.filter(f => f.id !== editedField.id && !f.isDerived);
  };

  const showOptions = ['select', 'radio', 'checkbox'].includes(editedField.type);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Edit Field</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Basic Properties */}
        <TextField
          label="Label"
          value={editedField.label}
          onChange={(e) => handleFieldChange('label', e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Placeholder"
          value={editedField.placeholder || ''}
          onChange={(e) => handleFieldChange('placeholder', e.target.value)}
          fullWidth
          size="small"
        />

        <FormControlLabel
          control={
            <Switch
              checked={editedField.required || false}
              onChange={(e) => handleFieldChange('required', e.target.checked)}
            />
          }
          label="Required"
        />

        <FormControlLabel
          control={
            <Switch
              checked={editedField.isDerived || false}
              onChange={(e) => handleDerivedFieldToggle(e.target.checked)}
            />
          }
          label="Derived Field"
        />

        {/* Derived Field Configuration */}
        {editedField.isDerived && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Derived Field Configuration
              </Typography>

              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Formula Type</InputLabel>
                <Select
                  value={editedField.derivedConfig?.formulaType || 'custom'}
                  onChange={(e) => handleDerivedConfigChange({ formulaType: e.target.value as any })}
                  label="Formula Type"
                >
                  <MenuItem value="custom">Custom Formula</MenuItem>
                  <MenuItem value="age_from_dob">Age from Date of Birth</MenuItem>
                  <MenuItem value="sum">Sum of Fields</MenuItem>
                  <MenuItem value="average">Average of Fields</MenuItem>
                  <MenuItem value="concat">Concatenate Fields</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={getAvailableParentFields()}
                getOptionLabel={(option) => option.label}
                value={getAvailableParentFields().filter(f =>
                  editedField.derivedConfig?.parentFieldIds.includes(f.id)
                )}
                onChange={(_, newValue) => {
                  handleDerivedConfigChange({
                    parentFieldIds: newValue.map(f => f.id)
                  });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={option.id}
                        variant="outlined"
                        label={option.label}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Parent Fields"
                    placeholder="Select parent fields"
                    size="small"
                  />
                )}
                sx={{ mb: 2 }}
              />

              {editedField.derivedConfig?.formulaType === 'custom' && (
                <TextField
                  label="Custom Formula"
                  value={editedField.derivedConfig?.formula || ''}
                  onChange={(e) => handleDerivedConfigChange({ formula: e.target.value })}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  helperText="Use field IDs in your formula (e.g., field1 + field2)"
                />
              )}
            </Box>
          </>
        )}

        {/* Options for select, radio, checkbox */}
        {showOptions && (
          <>
            <Divider />
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Options</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </Box>
              
              <List dense>
                {editedField.options?.map((option, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <TextField
                        label="Label"
                        value={option.label}
                        onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Value"
                        value={option.value}
                        onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOption(index)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}

        {/* Validation Rules */}
        <Divider />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">Validation Rules</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddValidationRule}
            >
              Add Rule
            </Button>
          </Box>
          
          <List dense>
            {editedField.validationRules?.map((rule, index) => (
              <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1 }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={rule.type}
                      onChange={(e) => handleUpdateValidationRule(index, 'type', e.target.value)}
                      label="Type"
                    >
                      <MenuItem value="required">Required</MenuItem>
                      <MenuItem value="minLength">Min Length</MenuItem>
                      <MenuItem value="maxLength">Max Length</MenuItem>
                      <MenuItem value="pattern">Pattern</MenuItem>
                      <MenuItem value="min">Min Value</MenuItem>
                      <MenuItem value="max">Max Value</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteValidationRule(index)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {['minLength', 'maxLength', 'min', 'max', 'pattern'].includes(rule.type) && (
                  <TextField
                    label="Value"
                    value={rule.value || ''}
                    onChange={(e) => handleUpdateValidationRule(index, 'value', e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                )}
                
                <TextField
                  label="Error Message"
                  value={rule.message}
                  onChange={(e) => handleUpdateValidationRule(index, 'message', e.target.value)}
                  size="small"
                  fullWidth
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Save Button */}
        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default FormFieldEditor;
