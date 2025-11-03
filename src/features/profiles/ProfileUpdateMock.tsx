import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../components/generic/GenericForm';
import apiClient from '../../lib/api';
import { useNotifications } from '../../utils/notifications';

type ProfileInput = {
  phone: string;
  photo: string;
};

const ProfileUpdateMock: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = false;
  const [value, setValue] = useState<ProfileInput>({ phone: '', photo: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get(`/api/profiles/${id}`);
        setValue({ phone: data.phone || '', photo: data.photo || '' });
      } catch {
        showError('Error al cargar el perfil');
      }
    })();
  }, [id, showError]);

  const save = async () => {
    try {
      await apiClient.put(`/api/profiles/${id}`, value);
      showSuccess('Perfil actualizado correctamente');
      navigate(`/profile/${id}`);
    } catch {
      showError('Error al guardar el perfil');
    }
  };

  return (
    <GenericForm
      title={'Actualizar Perfil'}
      subtitle="Modificar información del perfil"
      fields={[
        { name: 'phone', label: 'Teléfono', type: 'text' as const, required: true },
        { name: 'photo', label: 'Foto', type: 'text' as const, required: false, placeholder: 'ruta o URL' },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate(`/profile/${id}`)}
      isNew={isNew}
      submitLabel={'Actualizar'}
    />
  );
};

export default ProfileUpdateMock;


