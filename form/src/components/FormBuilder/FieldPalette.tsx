import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  TextFields as TextIcon,
  Email as EmailIcon,
  Numbers as NumberIcon,
  Subject as TextAreaIcon,
  ArrowDropDown as SelectIcon,
  CheckBox as CheckboxIcon,
  RadioButtonChecked as RadioIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store';
import { addField } from '../../store/formSlice';
import { FormField } from '../../types/form';

interface FieldType {
  type: FormField['type'];
  label: string;
  icon: React.ReactNode;
  defaultProps: Partial<FormField>;
}

const fieldTypes: FieldType[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: <TextIcon />,
    defaultProps: {
      label: 'Text Field',
      placeholder: 'Enter text...',
    },
  },
  {
    type: 'email',
    label: 'Email Input',
    icon: <EmailIcon />,
    defaultProps: {
      label: 'Email',
      placeholder: 'Enter email address...',
      validationRules: [
        { type: 'email', message: 'Please enter a valid email address' },
      ],
    },
  },
  {
    type: 'number',
    label: 'Number Input',
    icon: <NumberIcon />,
    defaultProps: {
      label: 'Number',
      placeholder: 'Enter number...',
    },
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: <TextAreaIcon />,
    defaultProps: {
      label: 'Text Area',
      placeholder: 'Enter long text...',
    },
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    icon: <SelectIcon />,
    defaultProps: {
      label: 'Select Option',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckboxIcon />,
    defaultProps: {
      label: 'Checkbox',
      defaultValue: false,
    },
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: <RadioIcon />,
    defaultProps: {
      label: 'Radio Group',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: <DateIcon />,
    defaultProps: {
      label: 'Date',
    },
  },
];

const FieldPalette: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.forms);

  const handleAddField = (fieldType: FieldType) => {
    if (!currentForm) return;

    // Check if this field type already exists (except for text, number, and textarea which can have multiple instances)
    const allowMultiple = ['text', 'number', 'textarea'];
    const existingFieldOfType = currentForm.fields.find(field => field.type === fieldType.type);

    if (existingFieldOfType && !allowMultiple.includes(fieldType.type)) {
      // Field type already exists and multiple instances are not allowed
      return;
    }

    // Generate a unique label if the field type allows multiple instances
    let label = fieldType.defaultProps.label || fieldType.label;
    if (allowMultiple.includes(fieldType.type)) {
      const existingCount = currentForm.fields.filter(field => field.type === fieldType.type).length;
      if (existingCount > 0) {
        label = `${label} ${existingCount + 1}`;
      }
    }

    dispatch(addField({
      type: fieldType.type,
      label: label,
      placeholder: fieldType.defaultProps.placeholder,
      required: false,
      validationRules: fieldType.defaultProps.validationRules || [],
      options: fieldType.defaultProps.options,
      defaultValue: fieldType.defaultProps.defaultValue,
    }));
  };

  const getFieldStatus = (fieldType: FieldType) => {
    if (!currentForm) return { disabled: true, reason: 'No form selected' };

    const allowMultiple = ['text', 'number', 'textarea'];
    const existingFieldOfType = currentForm.fields.find(field => field.type === fieldType.type);

    if (existingFieldOfType && !allowMultiple.includes(fieldType.type)) {
      return { disabled: true, reason: 'Already added' };
    }

    return { disabled: false, reason: '' };
  };

  return (
    <List>
      {fieldTypes.map((fieldType) => {
        const status = getFieldStatus(fieldType);
        return (
          <ListItem key={fieldType.type} disablePadding>
            <Paper
              elevation={status.disabled ? 0 : 1}
              sx={{
                width: '100%',
                mb: 1,
                backgroundColor: status.disabled ? 'grey.100' : 'background.paper',
                '&:hover': {
                  elevation: status.disabled ? 0 : 3,
                  cursor: status.disabled ? 'not-allowed' : 'pointer',
                },
              }}
            >
              <ListItemButton
                onClick={() => handleAddField(fieldType)}
                disabled={status.disabled}
                sx={{
                  py: 1.5,
                  opacity: status.disabled ? 0.5 : 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {fieldType.icon}
                </ListItemIcon>
                <ListItemText
                  primary={fieldType.label}
                  secondary={status.reason}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: 'text.secondary',
                  }}
                />
              </ListItemButton>
            </Paper>
          </ListItem>
        );
      })}
    </List>
  );
};

export default FieldPalette;
