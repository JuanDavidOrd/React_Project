import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type RoleInput = {
  name: string;
  description?: string;
};

const RoleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<RoleInput>({ name: '', description: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/roles/${id}`);
          setValue({ name: data.name || '', description: data.description || '' });
        } catch {
          showError('Error al cargar el rol');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew) {
        await apiClient.post('/api/roles/', value);
        showSuccess('Rol creado correctamente');
      } else {
        await apiClient.put(`/api/roles/${id}`, value);
        showSuccess('Rol actualizado correctamente');
      }
      navigate('/roles');
    } catch {
      showError('Error al guardar el rol');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Rol' : 'Editar Rol'}
      subtitle="Catálogo de roles"
      fields={[
        { name: 'name', label: 'Nombre', type: 'text' as const, required: true },
        { name: 'description', label: 'Descripción', type: 'text' as const, required: false }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/roles')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default RoleEdit;


