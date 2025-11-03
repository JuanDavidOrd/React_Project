import React, { useState } from 'react';
import Layout from '../Layout';
import { useUiLibrary } from '../../context/UiLibraryContext';
import { Link } from 'react-router-dom';
import Avatar from 'boring-avatars';
import { Card, CardContent, CardHeader, Button, Box, Typography, Avatar as MuiAvatar } from '@mui/material';

type Field = {
  label: string;
  value: string | React.ReactNode;
  type?: 'text' | 'image' | 'link';
};

type Props = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageFallback?: string;
  fields: Field[];
  editPath?: string;
  backPath?: string;
  backLabel?: string;
};

function GenericDetailView({
  title,
  subtitle,
  imageUrl,
  imageFallback,
  fields,
  editPath,
  backPath,
  backLabel = 'Volver'
}: Props) {
  const { library } = useUiLibrary();
  const [imageError, setImageError] = useState(false);

  const avatarColors = library === 'bootstrap'
    ? ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']
    : library === 'mui'
    ? ['#1976d2', '#1565c0', '#0d47a1', '#42a5f5', '#64b5f6']
    : ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'];
  
  const showImage = imageUrl && !imageError;

  const renderImage = () => {
    if (showImage) {
      return (
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImageError(true)}
          className={library === 'bootstrap' ? 'img-fluid rounded' : library === 'tailwind' ? 'w-full h-full object-cover rounded-xl' : 'w-full h-full object-cover'}
          style={library === 'mui' ? { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' } : undefined}
        />
      );
    }

    if (library === 'mui') {
      return (
        <MuiAvatar
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'primary.main',
            fontSize: '4rem',
            borderRadius: '16px'
          }}
        >
          {imageFallback?.[0]?.toUpperCase() || 'U'}
        </MuiAvatar>
      );
    }

    return (
      <Avatar
        size={library === 'bootstrap' ? 280 : 300}
        name={imageFallback || 'User'}
        variant="marble"
        colors={avatarColors}
      />
    );
  };

  const renderField = (field: Field, idx: number) => {
    if (library === 'mui') {
      return (
        <Box key={idx} sx={{ mb: 3, pb: idx < fields.length - 1 ? 3 : 0, borderBottom: idx < fields.length - 1 ? '1px solid #e5e5e5' : 'none' }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.5px' }}>
            {field.label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {field.type === 'link' ? (
              <Link
                to={field.value as string}
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                {field.value}
              </Link>
            ) : (
              field.value || '-'
            )}
          </Typography>
        </Box>
      );
    }

    if (library === 'bootstrap') {
      return (
        <div key={idx} className={`mb-3 ${idx < fields.length - 1 ? 'pb-3 border-bottom' : ''}`}>
          <small className="text-muted text-uppercase fw-bold d-block mb-2">{field.label}</small>
          <div>
            {field.type === 'link' ? (
              <Link to={field.value as string} className="text-primary text-decoration-none">
                {field.value}
              </Link>
            ) : (
              <span>{field.value || '-'}</span>
            )}
          </div>
        </div>
      );
    }

    // Tailwind
    return (
      <div key={idx} className={`mb-4 ${idx < fields.length - 1 ? 'pb-4 border-b border-gray-200' : ''}`}>
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          {field.label}
        </div>
        <div className="text-base text-gray-900">
          {field.type === 'link' ? (
            <Link to={field.value as string} className="text-blue-600 hover:text-blue-800">
              {field.value}
            </Link>
          ) : (
            field.value || '-'
          )}
        </div>
      </div>
    );
  };

  const renderActions = () => {
    if (!editPath && !backPath) return null;

    if (library === 'mui') {
      return (
        <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e5e5e5' }}>
          {editPath && (
            <Button
              variant="contained"
              component={Link}
              to={editPath}
              sx={{ textTransform: 'uppercase' }}
            >
              Editar
            </Button>
          )}
          {backPath && (
            <Button
              variant="outlined"
              component={Link}
              to={backPath}
              sx={{ textTransform: 'uppercase' }}
            >
              {backLabel}
            </Button>
          )}
        </Box>
      );
    }

    if (library === 'bootstrap') {
      return (
        <div className="d-flex gap-2 mt-4 pt-3 border-top">
          {editPath && (
            <Link to={editPath} className="btn btn-primary">
              Editar
            </Link>
          )}
          {backPath && (
            <Link to={backPath} className="btn btn-secondary">
              {backLabel}
            </Link>
          )}
        </div>
      );
    }

    // Tailwind
    return (
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        {editPath && (
          <Link
            to={editPath}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Editar
          </Link>
        )}
        {backPath && (
          <Link
            to={backPath}
            className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            {backLabel}
          </Link>
        )}
      </div>
    );
  };

  if (library === 'mui') {
    return (
      <Layout>
        <Box sx={{ maxWidth: '960px', margin: '0 auto' }}>
          <Card>
            <CardHeader
              title={title}
              subheader={subtitle}
              titleTypographyProps={{ variant: 'h4', fontWeight: 700, color: 'primary' }}
              subheaderTypographyProps={{ variant: 'body1' }}
            />
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 4, alignItems: 'start' }}>
                <Box
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: '#f5f5f5',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {renderImage()}
                </Box>
                <Box>
                  {fields.map((field, idx) => renderField(field, idx))}
                  {renderActions()}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Layout>
    );
  }

  if (library === 'bootstrap') {
    return (
      <Layout>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-1 text-uppercase">{title}</h4>
              {subtitle && <p className="card-subtitle text-muted mb-0">{subtitle}</p>}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  <div
                    className="bg-light rounded overflow-hidden"
                    style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {renderImage()}
                  </div>
                </div>
                <div className="col-md-8">
                  {fields.map((field, idx) => renderField(field, idx))}
                  {renderActions()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Tailwind
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
                {renderImage()}
              </div>
              <div className="md:col-span-2">
                {fields.map((field, idx) => renderField(field, idx))}
                {renderActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GenericDetailView;
