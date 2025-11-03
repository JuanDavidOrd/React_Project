import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type UserRoleInput = {
  user_id: string;
  role_id: string;
  startAt: string;
  endAt?: string;
};

const UserRoleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<UserRoleInput>({
    user_id: '',
    role_id: '',
    startAt: new Date().toISOString().split('T')[0],
    endAt: '',
  });
  const { showError, showSuccess, showWarning } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/user-roles/${id}`);
          setValue({
            user_id: String(data.user_id),
            role_id: String(data.role_id),
            startAt: data.startAt?.split('T')[0] || '',
            endAt: data.endAt?.split('T')[0] || '',
          });
        } catch (err) {
          showError('Error al cargar la asignación de rol');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew) {
        if (!value.user_id || value.user_id.trim() === '') {
          showWarning('El User ID es obligatorio');
          return;
        }
        if (!value.role_id || value.role_id.trim() === '') {
          showWarning('El Role ID es obligatorio');
          return;
        }
      }
      
      if (!value.startAt) {
        showWarning('La fecha de inicio es obligatoria');
        return;
      }
      
      const payload: any = {
        startAt: new Date(value.startAt + 'T12:00:00.000Z').toISOString(),
      };
      
      if (value.endAt && value.endAt.trim() !== '') {
        payload.endAt = new Date(value.endAt + 'T12:00:00.000Z').toISOString();
      }
      
      if (isNew) {
        await apiClient.post(`/api/user-roles/user/${value.user_id}/role/${value.role_id}`, payload);
        showSuccess('Rol asignado correctamente');
      } else {
        await apiClient.put(`/api/user-roles/${id}`, payload);
        showSuccess('Asignación actualizada correctamente');
      }
      navigate('/user-roles');
    } catch (err: any) {
      let errorMsg = 'Error al guardar';
      
      if (err.response?.status === 404) {
        errorMsg = isNew 
          ? `El usuario ID ${value.user_id} o el rol ID ${value.role_id} no existen`
          : 'Asignación de rol no encontrada';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      showError(errorMsg);
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Asignar Rol a Usuario' : 'Editar Fechas de Asignación'}
      subtitle={isNew 
        ? "Relación N:N - Un usuario puede tener múltiples roles diferentes" 
        : "Nota: Solo puedes editar las fechas. Para cambiar usuario o rol, crea una nueva asignación."}
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, placeholder: 'ID del usuario', disabled: !isNew },
        { name: 'role_id', label: 'Rol ID', type: 'number' as const, required: true, placeholder: 'ID del rol', disabled: !isNew },
        { name: 'startAt', label: 'Fecha de Inicio', type: 'date' as const, required: true },
        { name: 'endAt', label: 'Fecha de Fin (Opcional)', type: 'date' as const, required: false }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/user-roles')}
      isNew={isNew}
      submitLabel={isNew ? 'Asignar Rol' : 'Actualizar Fechas'}
    />
  );
};

export default UserRoleEdit;
