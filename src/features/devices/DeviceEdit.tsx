import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type DeviceInput = {
  user_id: string;
  name: string;
  ip: string;
  operating_system?: string;
};

const DeviceEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<DeviceInput>({ user_id: '', name: '', ip: '', operating_system: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/devices/${id}`);
          setValue({ user_id: String(data.user_id), name: data.name || '', ip: data.ip || '', operating_system: data.operating_system || '' });
        } catch {
          showError('Error al cargar el dispositivo');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      const payload = { name: value.name, ip: value.ip, operating_system: value.operating_system };
      if (isNew) {
        await apiClient.post(`/api/devices/user/${value.user_id}`, payload);
        showSuccess('Dispositivo registrado correctamente');
      } else {
        await apiClient.put(`/api/devices/${id}`, payload);
        showSuccess('Dispositivo actualizado correctamente');
      }
      navigate('/devices');
    } catch {
      showError('Error al guardar el dispositivo');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Registrar Dispositivo' : 'Editar Dispositivo'}
      subtitle="1:N - Dispositivos por usuario"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'name', label: 'Nombre', type: 'text' as const, required: true },
        { name: 'ip', label: 'IP', type: 'text' as const, required: true },
        { name: 'operating_system', label: 'Sistema Operativo', type: 'text' as const, required: false }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/devices')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default DeviceEdit;


