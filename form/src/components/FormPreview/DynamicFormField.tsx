import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormField } from '../../types/form';

interface DynamicFormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const renderField = () => {
    const isReadOnly = field.isDerived;

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            error={!!error}
            helperText={error || (isReadOnly ? 'This field is automatically calculated' : '')}
            required={field.required}
            type={field.type}
            slotProps={{ input: { readOnly: isReadOnly } }}
            variant={isReadOnly ? 'filled' : 'outlined'}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            error={!!error}
            helperText={error || (isReadOnly ? 'This field is automatically calculated' : '')}
            required={field.required}
            type="number"
            slotProps={{ input: { readOnly: isReadOnly } }}
            variant={isReadOnly ? 'filled' : 'outlined'}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <FormLabel required={field.required}>{field.label}</FormLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          // Multiple checkboxes
          return (
            <FormControl component="fieldset" error={!!error}>
              <FormLabel component="legend" required={field.required}>
                {field.label}
              </FormLabel>
              <Box>
                {field.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={Array.isArray(value) ? value.includes(option.value) : false}
                        onChange={(e) => {
                          const currentValues = Array.isArray(value) ? value : [];
                          if (e.target.checked) {
                            onChange([...currentValues, option.value]);
                          } else {
                            onChange(currentValues.filter((v: string) => v !== option.value));
                          }
                        }}
                        onBlur={onBlur}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </Box>
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          );
        } else {
          // Single checkbox
          return (
            <FormControl error={!!error}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                    onBlur={onBlur}
                  />
                }
                label={field.label}
                required={field.required}
              />
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          );
        }

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => onChange(newValue ? newValue.toISOString() : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error,
                  required: field.required,
                  onBlur: onBlur,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            error={!!error}
            helperText={error}
            required={field.required}
          />
        );
    }
  };

  return <Box>{renderField()}</Box>;
};

export default DynamicFormField;
