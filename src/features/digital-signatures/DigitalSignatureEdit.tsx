import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type DigitalSignatureInput = {
  user_id: string;
  photo: string;
};

const DigitalSignatureEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<DigitalSignatureInput>({ user_id: '', photo: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/digital-signatures/${id}`);
          setValue({ user_id: String(data.user_id), photo: data.photo || '' });
        } catch {
          showError('Error al cargar la firma');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      const payload = { photo: value.photo };
      if (isNew) {
        await apiClient.post(`/api/digital-signatures/user/${value.user_id}`, payload);
        showSuccess('Firma digital creada correctamente');
      } else {
        await apiClient.put(`/api/digital-signatures/${id}`, payload);
        showSuccess('Firma digital actualizada correctamente');
      }
      navigate('/digital-signatures');
    } catch {
      showError('Error al guardar la firma');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Firma Digital' : 'Editar Firma Digital'}
      subtitle="1:1 - Firma por usuario"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'photo', label: 'Foto (texto o URL)', type: 'text' as const, required: true },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/digital-signatures')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default DigitalSignatureEdit;


