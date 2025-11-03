import React from 'react';
import { useUiLibrary } from '../context/UiLibraryContext';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

const UiLibrarySwitcher: React.FC = () => {
  const { library, setLibrary } = useUiLibrary();

  if (library === 'mui') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          UI:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>UI</InputLabel>
          <Select
            value={library}
            onChange={(e) => setLibrary(e.target.value as any)}
            label="UI"
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="tailwind">Tailwind</MenuItem>
            <MenuItem value="mui">Material UI</MenuItem>
            <MenuItem value="bootstrap">Bootstrap</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }

  if (library === 'bootstrap') {
    return (
      <div className="d-flex align-items-center gap-2">
        <label className="form-label mb-0 fw-semibold small">UI:</label>
        <select
          className="form-select form-select-sm"
          value={library}
          onChange={(e) => setLibrary(e.target.value as any)}
          style={{ width: 'auto', minWidth: '120px' }}
        >
          <option value="tailwind">Tailwind</option>
          <option value="mui">Material UI</option>
          <option value="bootstrap">Bootstrap</option>
        </select>
      </div>
    );
  }

  // Tailwind
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-gray-600">UI:</label>
      <select
        className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors cursor-pointer font-medium"
        value={library}
        onChange={(e) => setLibrary(e.target.value as any)}
      >
        <option value="tailwind">Tailwind</option>
        <option value="mui">Material UI</option>
        <option value="bootstrap">Bootstrap</option>
      </select>
    </div>
  );
};

export default UiLibrarySwitcher;
