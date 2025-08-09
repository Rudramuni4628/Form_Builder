import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { FormConfiguration, FormField } from '../../types/form';
import DynamicFormField from './DynamicFormField';

interface DynamicFormProps {
  form: FormConfiguration;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form }) => {
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitData, setSubmitData] = React.useState<any>(null);

  // Create validation schema from form fields
  const createValidationSchema = () => {
    const schemaFields: any = {};

    form.fields.forEach((field) => {
      let fieldSchema: any;

      // Base schema based on field type
      switch (field.type) {
        case 'email':
          fieldSchema = yup.string().email('Please enter a valid email address');
          break;
        case 'number':
          fieldSchema = yup.number().typeError('Please enter a valid number');
          break;
        case 'date':
          fieldSchema = yup.date().typeError('Please enter a valid date');
          break;
        default:
          fieldSchema = yup.string();
      }

      // Apply validation rules
      if (field.validationRules) {
        field.validationRules.forEach((rule) => {
          switch (rule.type) {
            case 'required':
              fieldSchema = fieldSchema.required(rule.message);
              break;
            case 'minLength':
              if (rule.value) {
                fieldSchema = fieldSchema.min(Number(rule.value), rule.message);
              }
              break;
            case 'maxLength':
              if (rule.value) {
                fieldSchema = fieldSchema.max(Number(rule.value), rule.message);
              }
              break;
            case 'pattern':
              if (rule.value && typeof rule.value === 'string') {
                fieldSchema = fieldSchema.matches(new RegExp(rule.value), rule.message);
              }
              break;
            case 'min':
              if (rule.value && field.type === 'number') {
                fieldSchema = fieldSchema.min(Number(rule.value), rule.message);
              }
              break;
            case 'max':
              if (rule.value && field.type === 'number') {
                fieldSchema = fieldSchema.max(Number(rule.value), rule.message);
              }
              break;
            case 'email':
              fieldSchema = fieldSchema.email(rule.message);
              break;
          }
        });
      }

      // Handle required field
      if (field.required) {
        if (field.type === 'checkbox') {
          fieldSchema = yup.boolean().oneOf([true], 'This field is required');
        } else {
          fieldSchema = fieldSchema.required('This field is required');
        }
      }

      schemaFields[field.id] = fieldSchema;
    });

    return yup.object().shape(schemaFields);
  };

  const validationSchema = createValidationSchema();

  // Create default values
  const getDefaultValues = () => {
    const defaultValues: any = {};
    form.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.id] = field.defaultValue;
      } else {
        switch (field.type) {
          case 'checkbox':
            defaultValues[field.id] = false;
            break;
          case 'number':
            defaultValues[field.id] = '';
            break;
          default:
            defaultValues[field.id] = '';
        }
      }
    });
    return defaultValues;
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getDefaultValues(),
  });

  const watchedValues = watch();

  // Calculate derived field values
  const calculateDerivedValue = useCallback((field: FormField): any => {
    if (!field.isDerived || !field.derivedConfig) return '';

    const { parentFieldIds, formulaType, formula } = field.derivedConfig;
    const parentValues = parentFieldIds.map((id: string) => watchedValues[id]);

    switch (formulaType) {
      case 'age_from_dob':
        if (parentValues[0]) {
          const birthDate = new Date(parentValues[0]);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        }
        return '';

      case 'sum':
        return parentValues.reduce((sum: number, val: any) => {
          const num = parseFloat(val) || 0;
          return sum + num;
        }, 0);

      case 'average':
        const validNumbers = parentValues.filter((val: any) => !isNaN(parseFloat(val)));
        if (validNumbers.length === 0) return '';
        const sum = validNumbers.reduce((sum: number, val: any) => sum + parseFloat(val), 0);
        return (sum / validNumbers.length).toFixed(2);

      case 'concat':
        return parentValues.filter((val: any) => val).join(' ');

      case 'custom':
        try {
          // Simple formula evaluation (for demo purposes)
          let expression = formula;
          parentFieldIds.forEach((id: string, index: number) => {
            const value = parentValues[index] || 0;
            expression = expression.replace(new RegExp(id, 'g'), value.toString());
          });
          // Basic math evaluation (unsafe in production, use a proper parser)
          // eslint-disable-next-line no-eval
          return eval(expression);
        } catch {
          return '';
        }

      default:
        return '';
    }
  }, [watchedValues]);

  // Update derived fields when parent values change
  useEffect(() => {
    form.fields.forEach(field => {
      if (field.isDerived) {
        const calculatedValue = calculateDerivedValue(field);
        setValue(field.id, calculatedValue);
      }
    });
  }, [watchedValues, setValue, calculateDerivedValue, form.fields]);

  const onSubmit = async (data: any) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', data);
    setSubmitData(data);
    setSubmitSuccess(true);
    
    // Reset form after successful submission
    reset();
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitData(null);
  };

  // Sort fields by order
  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sortedFields.map((field) => (
          <Controller
            key={field.id}
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <DynamicFormField
                field={field}
                value={controllerField.value}
                onChange={controllerField.onChange}
                onBlur={controllerField.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        ))}

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Form submitted successfully!
          {submitData && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" component="div">
                Submitted data: {JSON.stringify(submitData, null, 2)}
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DynamicForm;
