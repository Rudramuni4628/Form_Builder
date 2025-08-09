import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../../store';
import { createForm, updateForm, reorderFields } from '../../store/formSlice';
import FieldPalette from './FieldPalette';
import FormFieldEditor from './FormFieldEditor';
import SortableFormField from './SortableFormField';
import { FormField } from '../../types/form';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.forms);
  const [isNewFormDialogOpen, setIsNewFormDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedField, setSelectedField] = useState<FormField | null>(null);

  const handleCreateNewForm = () => {
    if (formName.trim()) {
      dispatch(createForm({
        name: formName.trim(),
        description: formDescription.trim(),
        fields: [],
      }));
      setFormName('');
      setFormDescription('');
      setIsNewFormDialogOpen(false);
    }
  };

  const handleSaveForm = () => {
    if (currentForm) {
      dispatch(updateForm(currentForm));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentForm) {
      const oldIndex = currentForm.fields.findIndex((field) => field.id === active.id);
      const newIndex = currentForm.fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = [...currentForm.fields];
        const [movedField] = newFields.splice(oldIndex, 1);
        newFields.splice(newIndex, 0, movedField);
        dispatch(reorderFields(newFields));
      }
    }
  };

  const handleFieldSelect = (field: FormField) => {
    setSelectedField(field);
  };

  const handleFieldDeselect = () => {
    setSelectedField(null);
  };

  return (
    <Box sx={{ height: '80vh', overflow: 'hidden' }}>
      <Box sx={{
        display: 'flex',
        gap: 2,
        height: '100%',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Field Palette */}
        <Box sx={{
          width: { xs: '100%', md: '300px' },
          minWidth: '250px',
          height: { xs: '300px', md: '100%' }
        }}>
          <Paper sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>
              Field Types
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
              <FieldPalette />
            </Box>
          </Paper>
        </Box>

        {/* Form Canvas */}
        <Box sx={{
          flexGrow: 1,
          minWidth: 0,
          height: { xs: '400px', md: '100%' }
        }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
              minHeight: '48px',
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Typography variant="h6" sx={{ flexGrow: 1, minWidth: '200px' }}>
                {currentForm ? currentForm.name : 'No Form Selected'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                {!currentForm && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsNewFormDialogOpen(true)}
                    size="small"
                  >
                    New Form
                  </Button>
                )}
                {currentForm && (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveForm}
                    size="small"
                  >
                    Save Form
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>
              {currentForm ? (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={currentForm.fields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Box sx={{ minHeight: 200 }}>
                      {currentForm.fields.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                          Drag field types from the left panel to start building your form
                        </Typography>
                      ) : (
                        currentForm.fields.map((field) => (
                          <SortableFormField
                            key={field.id}
                            field={field}
                            isSelected={selectedField?.id === field.id}
                            onSelect={() => handleFieldSelect(field)}
                          />
                        ))
                      )}
                    </Box>
                  </SortableContext>
                </DndContext>
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  py: 4
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Create a new form to start building
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Field Editor */}
        <Box sx={{
          width: { xs: '100%', md: '300px' },
          minWidth: '250px',
          height: { xs: '400px', md: '100%' }
        }}>
          <Paper sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>
              Field Properties
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
              {selectedField ? (
                <FormFieldEditor field={selectedField} onClose={handleFieldDeselect} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a field to edit its properties
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* New Form Dialog */}
      <Dialog open={isNewFormDialogOpen} onClose={() => setIsNewFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewFormDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNewForm} variant="contained" disabled={!formName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder;
