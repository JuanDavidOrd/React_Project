import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { useUiLibrary } from '../../context/UiLibraryContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  title: string;
  subtitle: string;
  data: T[];
  columns: Column<T>[];
  onDelete: (row: T) => void;
  createPath: string;
  editPath: (row: T) => string;
  emptyMessage?: string;
};

function GenericList<T extends { id: string | number }>({
  title,
  subtitle,
  data,
  columns,
  onDelete,
  createPath,
  editPath,
  emptyMessage = 'No hay datos registrados'
}: Props<T>) {
  const navigate = useNavigate();
  const { library } = useUiLibrary();

  const renderCreateButton = () => {
    if (library === 'mui') {
      return (
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate(createPath)}
          sx={{ textTransform: 'uppercase' }}
        >
          {title.split(' ')[0]}
        </Button>
      );
    }

    if (library === 'bootstrap') {
      return (
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => navigate(createPath)}
        >
          <Plus size={16} />
          Crear {title.split(' ')[0]}
        </button>
      );
    }

    // Tailwind
    return (
      <button
        className="px-4 py-2 bg-gray-900 text-black rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        onClick={() => navigate(createPath)}
      >
        <Plus size={16} />
        Crear {title.split(' ')[0]}
      </button>
    );
  };

  const renderActions = (row: T) => {
    if (library === 'mui') {
      return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(editPath(row))}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      );
    }

    if (library === 'bootstrap') {
      return (
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
            onClick={() => navigate(editPath(row))}
          >
            <Edit size={14} />
            Editar
          </button>
          <button
            className="btn btn-sm btn-danger d-flex align-items-center gap-1"
            onClick={() => onDelete(row)}
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      );
    }

    // Tailwind
    return (
      <div className="flex gap-2 justify-end">
        <button
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          onClick={() => navigate(editPath(row))}
        >
          <Edit size={14} />
          Editar
        </button>
        <button
          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          onClick={() => onDelete(row)}
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    );
  };

  if (library === 'mui') {
    return (
      <Layout>
        <Card>
          <CardHeader
            title={title}
            subheader={subtitle}
            action={renderCreateButton()}
            titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
            subheaderTypographyProps={{ variant: 'body2' }}
          />
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#1976d2' }}>
                        {col.label}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#1976d2' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          {emptyMessage}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row.id} hover>
                        {columns.map((col) => (
                          <TableCell key={String(col.key)}>
                            {col.render ? col.render(row) : String(row[col.key as keyof T] || '')}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          {renderActions(row)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (library === 'bootstrap') {
    return (
      <Layout>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">{title}</h5>
              <p className="card-subtitle text-muted mb-0 small">{subtitle}</p>
            </div>
            {renderCreateButton()}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    {columns.map((col) => (
                      <th key={String(col.key)}>{col.label}</th>
                    ))}
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-5 text-muted">
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr key={row.id}>
                        {columns.map((col) => (
                          <td key={String(col.key)}>
                            {col.render ? col.render(row) : String(row[col.key as keyof T] || '')}
                          </td>
                        ))}
                        <td className="text-end">{renderActions(row)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Tailwind
  return (
    <Layout>
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          {renderCreateButton()}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-900">
                        {col.render ? col.render(row) : String(row[col.key as keyof T] || '')}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">{renderActions(row)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default GenericList;
