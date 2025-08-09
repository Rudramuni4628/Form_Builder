# React + Redux Form Builder

A dynamic form builder application built with React, TypeScript, Redux Toolkit, and Material-UI. Users can create custom forms with various field types, validation rules, and derived fields, then preview and manage them with localStorage persistence.

## 🚀 Features

### Core Functionality
- **Dynamic Form Creation**: Build forms by adding and configuring various field types
- **Form Preview**: Test forms as end users would see them with full validation
- **Form Management**: View, edit, duplicate, and delete saved forms
- **LocalStorage Persistence**: All form configurations are automatically saved locally

### Field Types Supported
- **Text Input**: Basic text fields with validation
- **Email Input**: Email fields with built-in email validation
- **Number Input**: Numeric fields with min/max validation
- **Textarea**: Multi-line text input
- **Select Dropdown**: Single-choice dropdown menus
- **Radio Buttons**: Single-choice radio button groups
- **Checkboxes**: Multiple-choice checkboxes
- **Date Picker**: Date selection fields

### Advanced Features
- **Derived Fields**: Fields that automatically calculate values based on other fields
  - Age from Date of Birth
  - Sum of numeric fields
  - Average of numeric fields
  - Concatenation of text fields
  - Custom formula evaluation
- **Validation Rules**: Comprehensive validation system
  - Required fields
  - Min/Max length
  - Min/Max values
  - Email format validation
  - Custom regex patterns
- **Drag & Drop**: Reorder form fields with intuitive drag-and-drop
- **Duplicate Prevention**: Smart prevention of duplicate field types (except text, number, textarea)

## 🛠 Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v6
- **Form Handling**: React Hook Form with Yup validation
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router DOM
- **Persistence**: Browser localStorage

## 📁 Project Structure

```
src/
├── components/
│   ├── FormBuilder/
│   │   ├── FieldPalette.tsx          # Available field types
│   │   ├── FormFieldEditor.tsx       # Field configuration panel
│   │   └── SortableFormField.tsx     # Draggable form field component
│   ├── FormPreview/
│   │   ├── DynamicForm.tsx           # Form renderer with validation
│   │   └── DynamicFormField.tsx      # Individual field renderer
│   └── Layout/
│       └── Layout.tsx                # Main app layout with navigation
├── pages/
│   ├── CreateForm.tsx                # Form builder page (/create)
│   ├── PreviewForm.tsx               # Form preview page (/preview)
│   └── MyForms.tsx                   # Saved forms list (/myforms)
├── store/
│   ├── formSlice.ts                  # Redux slice for form management
│   ├── localStorageMiddleware.ts     # localStorage persistence
│   └── index.ts                      # Store configuration
├── types/
│   └── form.ts                       # TypeScript type definitions
└── App.tsx                           # Main app component with routing
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🧭 Navigation & Routes

The application uses React Router with three main routes:

- **`/create`** - Form Builder: Create and edit forms
- **`/preview`** - Form Preview: Test forms as end users
- **`/myforms`** - My Forms: Manage saved forms

## 📝 Usage Guide

### Creating a Form

1. Navigate to `/create`
2. Click "New Form" to create a new form
3. Add fields by clicking on field types in the left panel
4. Configure field properties in the right panel:
   - Set labels and placeholders
   - Add validation rules
   - Configure derived field logic
   - Set default values
5. Drag and drop to reorder fields
6. Click "Save Form" to persist your form

### Configuring Derived Fields

1. Select a field and toggle "Derived Field"
2. Choose parent fields that will provide input values
3. Select a formula type:
   - **Age from DOB**: Calculates age from a date field
   - **Sum**: Adds numeric values from selected fields
   - **Average**: Calculates average of numeric fields
   - **Concatenate**: Joins text from multiple fields
   - **Custom**: Write your own JavaScript expression

### Previewing Forms

1. Navigate to `/preview`
2. Test form validation and submission
3. Derived fields update automatically as you type
4. Submit the form to see the collected data

### Managing Forms

1. Navigate to `/myforms`
2. View all saved forms with metadata
3. Search forms by name or description
4. Actions available:
   - **Preview**: Open form in preview mode
   - **Edit**: Open form in builder mode
   - **Duplicate**: Create a copy of the form
   - **Delete**: Remove the form permanently

## 🔧 Configuration

### Field Types Configuration

Field types are defined in `src/components/FormBuilder/FieldPalette.tsx`. Each field type includes:
- Default properties
- Icon representation
- Validation rules
- Options for select/radio/checkbox fields

### Validation Rules

Supported validation types:
- `required` - Field must have a value
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `pattern` - Custom regex pattern
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `email` - Valid email format

## 💾 Data Persistence

All form configurations are automatically saved to browser localStorage:
- Forms are saved after every modification
- Data persists across browser sessions
- No backend server required
- Export/import functionality can be added for data portability

## 🎨 Customization

### Theming
The app uses Material-UI's theming system. Customize colors and styles in `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

### Adding New Field Types
1. Add the field type to the `FormField` type in `src/types/form.ts`
2. Add the field configuration in `src/components/FormBuilder/FieldPalette.tsx`
3. Implement rendering logic in `src/components/FormPreview/DynamicFormField.tsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for React Router

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Custom formula evaluation uses `eval()` for demo purposes (should use a proper expression parser in production)
- Some MUI components show deprecation warnings (will be resolved in future updates)

## 🔮 Future Enhancements

- [ ] Form templates and themes
- [ ] Export/import form configurations
- [ ] Form analytics and submission tracking
- [ ] Multi-step form support
- [ ] Conditional field visibility
- [ ] File upload field type
- [ ] Integration with external APIs
- [ ] Form sharing and collaboration
