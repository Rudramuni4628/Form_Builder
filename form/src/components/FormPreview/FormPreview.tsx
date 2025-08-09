import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useAppSelector } from '../../store';
import DynamicForm from './DynamicForm';

const FormPreview: React.FC = () => {
  const { currentForm } = useAppSelector((state) => state.forms);

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No form selected for preview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create or select a form from the Form Builder tab to see the preview
        </Typography>
      </Box>
    );
  }

  if (currentForm.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Form has no fields
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add some fields to the form to see the preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentForm.name}
        </Typography>
        {currentForm.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {currentForm.description}
          </Typography>
        )}
        <Alert severity="info" sx={{ mb: 2 }}>
          This is how your form will appear to end users. You can test the validation and submission here.
        </Alert>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <DynamicForm form={currentForm} />
      </Paper>
    </Box>
  );
};

export default FormPreview;
