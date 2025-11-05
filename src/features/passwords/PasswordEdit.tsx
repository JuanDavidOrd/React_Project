import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type PasswordInput = {
  user_id: string;
  hash: string;     // se envía como "content"
  startAt: string;  // yyyy-mm-dd (input date)
  endAt: string;    // yyyy-mm-dd (input date)
};

const PasswordEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [value, setValue] = useState<PasswordInput>({
    user_id: '',
    hash: '',
    startAt: new Date().toISOString().split('T')[0],
    endAt: new Date().toISOString().split('T')[0],
  });

  const { showError, showSuccess, showWarning } = useNotifications();

  // Para pasar la hora de '2025-11-05' a '2025-11-05 12:00:00'
  const formatBackendDate = (ymd: string) => `${ymd} 12:00:00`;

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/passwords/${id}`);
          const toYMD = (s?: string) => (s ? new Date(s).toISOString().split('T')[0] : '');
          setValue({
            user_id: String(data.user_id),
            hash: data.content || '',
            startAt: toYMD(data.startAt) || new Date().toISOString().split('T')[0],
            endAt: toYMD(data.endAt) || new Date().toISOString().split('T')[0],
          });
        } catch {
          showError('Error al cargar el registro de contraseña');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew && !value.user_id.trim()) return showWarning('El User ID es obligatorio');
      if (!value.hash.trim()) return showWarning('El contenido (hash) es obligatorio');
      if (!value.startAt.trim()) return showWarning('startAt es obligatorio');
      if (!value.endAt.trim()) return showWarning('endAt es obligatorio');

      // Validación simple: endAt >= startAt
      const s = new Date(value.startAt);
      const e = new Date(value.endAt);
      if (e.getTime() < s.getTime()) {
        showWarning('endAt no puede ser anterior a startAt');
        return;
      }

      const payload = {
        content: value.hash.trim(),
        startAt: formatBackendDate(value.startAt),
        endAt: formatBackendDate(value.endAt),
      };

      if (isNew) {
        await apiClient.post(`/api/passwords/user/${value.user_id}`, payload);
        showSuccess('Registro de contraseña creado correctamente');
      } else {
        await apiClient.put(`/api/passwords/${id}`, payload);
        showSuccess('Registro de contraseña actualizado correctamente');
      }
      navigate('/passwords');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al guardar el registro';
      showError(msg);
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Registro de Contraseña' : 'Editar Registro de Contraseña'}
      subtitle="1:N - Historial de contraseñas"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'hash', label: 'Hash / Contenido de la contraseña', type: 'text' as const, required: true },
        { name: 'startAt', label: 'Fecha inicio (startAt)', type: 'date' as const, required: true },
        { name: 'endAt', label: 'Fecha fin (endAt)', type: 'date' as const, required: true },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/passwords')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default PasswordEdit;
