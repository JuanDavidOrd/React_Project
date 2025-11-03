import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type AddressInput = {
  user_id: string;
  street: string;
  number: string;
  latitude?: string;
  longitude?: string;
};

const AddressEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<AddressInput>({ user_id: '', street: '', number: '', latitude: '', longitude: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/addresses/${id}`);
          setValue({ user_id: String(data.user_id), street: data.street || '', number: data.number || '', latitude: data.latitude || '', longitude: data.longitude || '' });
        } catch {
          showError('Error al cargar la dirección');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      const payload = { street: value.street, number: value.number, latitude: value.latitude, longitude: value.longitude };
      if (isNew) {
        await apiClient.post(`/api/addresses/user/${value.user_id}`, payload);
        showSuccess('Dirección creada correctamente');
      } else {
        await apiClient.put(`/api/addresses/${id}`, payload);
        showSuccess('Dirección actualizada correctamente');
      }
      navigate('/addresses');
    } catch {
      showError('Error al guardar la dirección');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Dirección' : 'Editar Dirección'}
      subtitle="1:1 - Dirección por usuario"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'street', label: 'Calle', type: 'text' as const, required: true },
        { name: 'number', label: 'Número', type: 'text' as const, required: true },
        { name: 'latitude', label: 'Latitud', type: 'text' as const, required: false },
        { name: 'longitude', label: 'Longitud', type: 'text' as const, required: false },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/addresses')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default AddressEdit;


