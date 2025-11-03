import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type PasswordInput = {
  user_id: string;
  hash: string;
};

const PasswordEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<PasswordInput>({ user_id: '', hash: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/passwords/${id}`);
          setValue({ user_id: String(data.user_id), hash: data.content || '' });
        } catch {
          showError('Error al cargar el registro de contraseña');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      const payload = { content: value.hash };
      if (isNew) {
        await apiClient.post(`/api/passwords/user/${value.user_id}`, payload);
        showSuccess('Registro de contraseña creado correctamente');
      } else {
        await apiClient.put(`/api/passwords/${id}`, payload);
        showSuccess('Registro de contraseña actualizado correctamente');
      }
      navigate('/passwords');
    } catch {
      showError('Error al guardar el registro');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Registro de Contraseña' : 'Editar Registro de Contraseña'}
      subtitle="1:N - Historial de contraseñas"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'hash', label: 'Hash', type: 'text' as const, required: true },
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


