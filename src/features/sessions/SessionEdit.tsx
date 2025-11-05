import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type SessionInput = {
  user_id: string;
  token: string;
  expiration: string;
  state: string;
  FACode?: string;
};

const SessionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<SessionInput>({
    user_id: '',
    token: '',
    expiration: '',
    state: 'active',
    FACode: '',
  });
  const { showError, showSuccess, showWarning } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/sessions/${id}`);
          let expirationDate = '';
          if (data.expiration) {
            const date = new Date(data.expiration);
            expirationDate = date.toISOString().split('T')[0];
          }
          
          setValue({
            user_id: String(data.user_id),
            token: data.token,
            expiration: expirationDate,
            state: data.state,
            FACode: data.FACode || '',
          });
        } catch (err) {
          showError('Error al cargar la sesión');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (!value.token || value.token.trim() === '') {
        showWarning('El token es obligatorio');
        return;
      }
      
      if (!value.expiration) {
        showWarning('La fecha de expiración es obligatoria');
        return;
      }
      
      if (isNew && (!value.user_id || value.user_id.trim() === '')) {
        showWarning('El User ID es obligatorio');
        return;
      }
      
      // Para converir de '2025-11-06' a '2025-11-06 12:00:00'
      const formatBackendDate = (dateString: string): string => {
        return `${dateString} 12:00:00`;
      };

      const expirationFormatted = formatBackendDate(value.expiration);
      
      const payload: any = {
        token: value.token.trim(),
        state: value.state,
        expiration: expirationFormatted,
      };

      
      if (value.FACode && value.FACode.trim() !== '') {
        payload.FACode = value.FACode.trim();
      }
      
      if (isNew) {
        await apiClient.post(`/api/sessions/user/${value.user_id}`, payload);
        showSuccess('Sesión creada correctamente');
      } else {
        await apiClient.put(`/api/sessions/${id}`, payload);
        showSuccess('Sesión actualizada correctamente');
      }
      navigate('/sessions');
    } catch (err: any) {
      let errorMsg = 'Error al guardar';
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMsg = 'No se pudo conectar con el servidor';
      } else if (err.response?.status === 404) {
        errorMsg = isNew 
          ? `El usuario con ID ${value.user_id} no existe en el sistema`
          : 'Sesión no encontrada';
      } else if (err.response?.status === 400) {
        errorMsg = `Datos inválidos: ${err.response?.data?.message || 'Verifica los campos'}`;
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
      title={isNew ? 'Crear Nueva Sesión' : 'Editar Sesión'}
      subtitle="Relación 1:N - Un usuario puede tener múltiples sesiones"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, placeholder: 'ID del usuario', disabled: !isNew },
        { name: 'token', label: 'Token', type: 'text' as const, required: true, placeholder: 'Token de sesión' },
        { name: 'expiration', label: 'Fecha de Expiración', type: 'date' as const, required: true },
        { name: 'state', label: 'Estado', type: 'select' as const, required: true, options: [
          { value: 'active', label: 'Activa' },
          { value: 'inactive', label: 'Inactiva' },
          { value: 'expired', label: 'Expirada' }
        ]},
        { name: 'FACode', label: 'Código 2FA (Opcional)', type: 'text' as const, required: false, placeholder: 'Código de autenticación de dos factores' }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/sessions')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear Sesión' : 'Guardar Cambios'}
    />
  );
};

export default SessionEdit;
