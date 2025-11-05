import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type UserRoleInput = {
  user_id: string;
  role_id: string;
  startAt: string;  // yyyy-mm-dd
  endAt: string;    // yyyy-mm-dd
};

const UserRoleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [value, setValue] = useState<UserRoleInput>({
    user_id: '',
    role_id: '',
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date().toISOString().split('T')[0],
  });

  const { showError, showSuccess, showWarning } = useNotifications();

  // '2025-11-21' -> '2025-11-21 12:00:00' (formato esperado por backend)
  const formatBackendDate = (dateString: string): string => `${dateString} 12:00:00`;

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/user-roles/${id}`);
          const toYMD = (s?: string) => (s ? new Date(s).toISOString().split('T')[0] : '');
          setValue({
            user_id: String(data.user_id),
            role_id: String(data.role_id),
            startAt: toYMD(data.startAt) || new Date().toISOString().split('T')[0],
            endAt: toYMD(data.endAt) || new Date().toISOString().split('T')[0],
          });
        } catch {
          showError('Error al cargar la asignación de rol');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    // Validaciones mínimas
    if (isNew) {
      if (!value.user_id?.trim()) return showWarning('El User ID es obligatorio');
      if (!value.role_id?.trim()) return showWarning('El Rol ID es obligatorio');
    }
    if (!value.startAt?.trim()) return showWarning('La fecha de inicio es obligatoria');
    if (!value.endAt?.trim()) return showWarning('La fecha de fin es obligatoria');

    if (new Date(value.endAt) < new Date(value.startAt)) {
      return showWarning('La fecha de fin no puede ser anterior a la fecha de inicio');
    }

    try {
      // --- Pre-chequeo de duplicado cuando es creación ---
      if (isNew) {
        try {
          const { data: all } = await apiClient.get('/api/user-roles/');
          const yaExiste = Array.isArray(all) && all.some((r: any) => {
            const sameUser = String(r.user_id) === value.user_id;
            const sameRole = String(r.role_id) === value.role_id;
            // Consideramos “activo” si su endAt es futura
            const activo = !r.endAt || new Date(r.endAt) >= new Date();
            return sameUser && sameRole && activo;
          });
          if (yaExiste) {
            showWarning('Ese usuario ya tiene asignado ese rol.');
            return;
          }
        } catch {
          // Si falla el pre-chequeo, continuamos y que decida el backend
        }
      }

      const payload: any = {
        startAt: formatBackendDate(value.startAt),
        endAt: formatBackendDate(value.endAt),
      };

      if (isNew) {
        await apiClient.post(
          `/api/user-roles/user/${value.user_id}/role/${value.role_id}`,
          payload
        );
        showSuccess('Rol asignado correctamente');
      } else {
        await apiClient.put(`/api/user-roles/${id}`, {
          user_id: Number(value.user_id),
          role_id: Number(value.role_id),
          ...payload,
        });
        showSuccess('Asignación actualizada correctamente');
      }

      navigate('/user-roles');
    } catch (err: any) {
      // mensajes para duplicados / validaciones
      if (err.response?.status === 400 || err.response?.status === 409) {
        const backendMsg: string =
          err.response?.data?.message ||
          err.response?.data?.error ||
          '';
        if (
          /ya tiene/i.test(backendMsg) ||
          /exists/i.test(backendMsg) ||
          /duplicate/i.test(backendMsg) ||
          /duplicado/i.test(backendMsg) ||
          /unique/i.test(backendMsg)
        ) {
          return showWarning('Ese usuario ya tiene asignado ese rol.');
        }
        return showWarning(`Datos inválidos: ${backendMsg || 'verifica los campos'}`);
      }

      if (err.code === 'ERR_NETWORK') return showError('No se pudo conectar con el servidor');
      if (err.response?.status === 404) {
        return showError(
          isNew
            ? `El usuario ID ${value.user_id} o el rol ID ${value.role_id} no existen`
            : 'Asignación de rol no encontrada'
        );
      }
      return showError(err.message || 'Error al guardar');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Asignar Rol a Usuario' : 'Editar Fechas de Asignación'}
      subtitle={
        isNew
          ? 'Relación N:N - Un usuario puede tener múltiples roles'
          : 'Nota: Solo puedes editar las fechas. Para cambiar usuario o rol, crea una nueva asignación.'
      }
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, placeholder: 'ID del usuario', disabled: !isNew },
        { name: 'role_id', label: 'Rol ID', type: 'number' as const, required: true, placeholder: 'ID del rol', disabled: !isNew },
        { name: 'startAt', label: 'Fecha de Inicio', type: 'date' as const, required: true },
        { name: 'endAt', label: 'Fecha de Fin', type: 'date' as const, required: true },
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
