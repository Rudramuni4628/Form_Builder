import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch } from '../../store';
import { deleteField } from '../../store/formSlice';
import { FormField } from '../../types/form';

interface SortableFormFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
}

const SortableFormField: React.FC<SortableFormFieldProps> = ({
  field,
  isSelected,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteField(field.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const getFieldTypeColor = (type: FormField['type']) => {
    const colors = {
      text: 'primary',
      email: 'secondary',
      number: 'success',
      textarea: 'info',
      select: 'warning',
      checkbox: 'error',
      radio: 'default',
      date: 'primary',
    } as const;
    return colors[type] || 'default';
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={isSelected ? 3 : 1}
      sx={{
        p: 2,
        mb: 2,
        cursor: 'pointer',
        border: isSelected ? 2 : 0,
        borderColor: 'primary.main',
        '&:hover': {
          elevation: 2,
        },
      }}
      onClick={onSelect}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Drag Handle */}
        <IconButton
          size="small"
          {...attributes}
          {...listeners}
          sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        >
          <DragIcon />
        </IconButton>

        {/* Field Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {field.label}
            </Typography>
            <Chip
              label={field.type}
              size="small"
              color={getFieldTypeColor(field.type)}
              variant="outlined"
            />
            {field.required && (
              <Chip
                label="Required"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>
          
          {field.placeholder && (
            <Typography variant="caption" color="text.secondary">
              Placeholder: {field.placeholder}
            </Typography>
          )}
          
          {field.options && field.options.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block">
              Options: {field.options.map(opt => opt.label).join(', ')}
            </Typography>
          )}
          
          {field.validationRules && field.validationRules.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block">
              Validations: {field.validationRules.length} rule(s)
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleEdit}
            color="primary"
            title="Edit field"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            color="error"
            title="Delete field"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default SortableFormField;
