import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { useUiLibrary } from '../../context/UiLibraryContext';
import { Card, CardContent, CardHeader, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'date' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
};

type Props<T> = {
  title: string;
  subtitle: string;
  fields: Field[];
  value: T;
  onChange: (value: T) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isNew: boolean;
  submitLabel?: string;
};

function GenericForm<T extends Record<string, any>>({
  title,
  subtitle,
  fields,
  value,
  onChange,
  onSubmit,
  onCancel,
  isNew,
  submitLabel
}: Props<T>) {
  const navigate = useNavigate();
  const { library } = useUiLibrary();

  const handleInputChange = (fieldName: string, newValue: any) => {
    onChange({ ...value, [fieldName]: newValue });
  };

  const renderField = (field: Field) => {
    const fieldValue = value[field.name] || '';

    if (library === 'mui') {
      return (
        <Box key={field.name} sx={{ mb: 3 }}>
          {field.type === 'select' ? (
            <FormControl fullWidth required={field.required} disabled={field.disabled}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={fieldValue}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                label={field.label}
              >
                {field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              type={field.type || 'text'}
              label={field.label}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
              variant="outlined"
            />
          )}
        </Box>
      );
    }

    if (library === 'bootstrap') {
      return (
        <div key={field.name} className="mb-3">
          <label className="form-label fw-semibold">{field.label}</label>
          {field.type === 'select' ? (
            <select
              className="form-select"
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              disabled={field.disabled}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="form-control"
              type={field.type || 'text'}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
            />
          )}
        </div>
      );
    }

    // Tailwind
    return (
      <div key={field.name} className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {field.label}
        </label>
        {field.type === 'select' ? (
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            disabled={field.disabled}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            type={field.type || 'text'}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
          />
        )}
      </div>
    );
  };

  const renderButtons = () => {
    if (library === 'mui') {
      return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #e5e5e5' }}>
          <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'uppercase' }}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" sx={{ textTransform: 'uppercase' }}>
            {submitLabel || (isNew ? 'Crear' : 'Guardar Cambios')}
          </Button>
        </Box>
      );
    }

    if (library === 'bootstrap') {
      return (
        <div className="card-footer bg-light d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success">
            {submitLabel || (isNew ? 'Crear' : 'Guardar Cambios')}
          </button>
        </div>
      );
    }

    // Tailwind
    return (
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {submitLabel || (isNew ? 'Crear' : 'Guardar Cambios')}
        </button>
      </div>
    );
  };

  if (library === 'mui') {
    return (
      <Layout>
        <Box sx={{ maxWidth: '600px' }}>
          <Card>
            <CardHeader
              title={title}
              subheader={subtitle}
              titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
              subheaderTypographyProps={{ variant: 'body2' }}
            />
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                {fields.map(renderField)}
                {renderButtons()}
              </form>
            </CardContent>
          </Card>
        </Box>
      </Layout>
    );
  }

  if (library === 'bootstrap') {
    return (
      <Layout>
        <div style={{ maxWidth: '600px' }}>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-1">{title}</h5>
              <p className="card-subtitle text-muted mb-0 small">{subtitle}</p>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                {fields.map(renderField)}
              </form>
            </div>
            {renderButtons()}
          </div>
        </div>
      </Layout>
    );
  }

  // Tailwind
  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          <div className="px-6 py-6">
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              {fields.map(renderField)}
              {renderButtons()}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GenericForm;
