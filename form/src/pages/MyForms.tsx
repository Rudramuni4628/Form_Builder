import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { deleteForm, setCurrentForm, createForm } from '../store/formSlice';
import { FormConfiguration } from '../types/form';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { forms } = useAppSelector((state) => state.forms);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormConfiguration | null>(null);

  const filteredForms = forms.filter((form) =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditForm = (form: FormConfiguration) => {
    dispatch(setCurrentForm(form));
    navigate('/create');
  };

  const handlePreviewForm = (form: FormConfiguration) => {
    dispatch(setCurrentForm(form));
    navigate('/preview');
  };

  const handleDeleteForm = (form: FormConfiguration) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const handleDuplicateForm = (form: FormConfiguration) => {
    const duplicatedForm = {
      ...form,
      name: `${form.name} (Copy)`,
      fields: form.fields.map(field => ({ ...field })), // Deep copy fields
    };
    delete (duplicatedForm as any).id;
    delete (duplicatedForm as any).createdAt;
    delete (duplicatedForm as any).updatedAt;
    
    dispatch(createForm(duplicatedForm));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (forms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No forms created yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Go to the Create Form tab to create your first form
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Forms
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your form configurations. You can edit, preview, duplicate, or delete forms from here.
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search forms by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {filteredForms.length === 0 ? (
        <Alert severity="info">
          No forms match your search criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredForms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {form.name}
                  </Typography>
                  
                  {form.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {form.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={`${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" display="block">
                    Created: {formatDate(form.createdAt)}
                  </Typography>
                  
                  {form.updatedAt !== form.createdAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Updated: {formatDate(form.updatedAt)}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewForm(form)}
                      title="Preview form"
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleEditForm(form)}
                      title="Edit form"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicateForm(form)}
                      title="Duplicate form"
                      color="secondary"
                    >
                      <CopyIcon />
                    </IconButton>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleDeleteForm(form)}
                    title="Delete form"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the form "{formToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyForms;
