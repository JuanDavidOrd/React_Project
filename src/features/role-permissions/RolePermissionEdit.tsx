import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type RolePermissionInput = {
  role_id: string;
  permission_id: string;
};

const RolePermissionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<RolePermissionInput>({ role_id: '', permission_id: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/role-permissions/${id}`);
          setValue({ role_id: String(data.role_id), permission_id: String(data.permission_id) });
        } catch {
          showError('Error al cargar la relación rol-permiso');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew) {
        await apiClient.post(`/api/role-permissions/role/${value.role_id}/permission/${value.permission_id}`, {});
        showSuccess('Relación rol-permiso creada correctamente');
      } else {
        await apiClient.put(`/api/role-permissions/${id}`, {});
        showSuccess('Relación rol-permiso actualizada correctamente');
      }
      navigate('/role-permissions');
    } catch {
      showError('Error al guardar la relación');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Rol ↔ Permiso' : 'Editar Rol ↔ Permiso'}
      subtitle="Relación N:N"
      fields={[
        { name: 'role_id', label: 'Rol ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'permission_id', label: 'Permiso ID', type: 'number' as const, required: true, disabled: !isNew },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/role-permissions')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default RolePermissionEdit;


