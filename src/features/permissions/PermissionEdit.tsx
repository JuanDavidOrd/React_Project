import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type PermissionInput = {
  entity: string;
  method: string;
  url: string;
};

const PermissionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<PermissionInput>({ entity: '', method: 'GET', url: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/permissions/${id}`);
          setValue({ entity: data.entity || '', method: data.method || 'GET', url: data.url || '' });
        } catch {
          showError('Error al cargar el permiso');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew) {
        await apiClient.post('/api/permissions/', value);
        showSuccess('Permiso creado correctamente');
      } else {
        await apiClient.put(`/api/permissions/${id}`, value);
        showSuccess('Permiso actualizado correctamente');
      }
      navigate('/permissions');
    } catch {
      showError('Error al guardar el permiso');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Permiso' : 'Editar Permiso'}
      subtitle="Entidad, método HTTP y URL protegida"
      fields={[
        { name: 'entity', label: 'Entidad', type: 'text' as const, required: true },
        { name: 'method', label: 'Método', type: 'select' as const, required: true, options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ] },
        { name: 'url', label: 'URL', type: 'text' as const, required: true, placeholder: '/api/...' }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/permissions')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default PermissionEdit;


