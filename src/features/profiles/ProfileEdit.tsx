import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { validateRequired, validateNumber } from '../../utils/formValidation';
import { useNotifications } from '../../utils/notifications';

type ProfileInput = {
  user_id: string;
  phone: string;
  photo?: string;
};

const ProfileEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<ProfileInput>({ user_id: '', phone: '', photo: '' });
  const { showError, showSuccess, showWarning } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/profiles/${id}`);
          setValue({ 
            user_id: String(data.user_id), 
            phone: data.phone, 
            photo: data.photo || '' 
          });
        } catch (err) {
          showError('Error al cargar el perfil');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    // Validaciones
    if (!validateRequired(value.phone)) {
      showWarning('El teléfono es obligatorio');
      return;
    }
    
    if (isNew && !validateRequired(value.user_id)) {
      showWarning('El User ID es obligatorio');
      return;
    }

    if (isNew && !validateNumber(value.user_id)) {
      showWarning('El User ID debe ser un número válido');
      return;
    }
    
  try {
    const form = new FormData();
    form.append("phone", value.phone.trim());

    // si colocan una URL o texto
    if (value.photo) {
      form.append("photo", value.photo.trim());
    }

    // MODO CREAR
    if (isNew) {
      const { data } = await apiClient.post(
        `/api/profiles/user/${value.user_id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      showSuccess("Perfil creado correctamente");

      const newId = data?.id ?? data?.profile?.id;
      navigate(`/profiles/${newId}`);
    }

    // MODO EDITAR
    else {
      await apiClient.put(`/api/profiles/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showSuccess("Perfil actualizado correctamente");
      navigate(`/profiles/${id}`);
    }
  } catch (err: any) {

      let errorMsg = 'Error al guardar';
      
      if (err.response?.status === 404) {
        errorMsg = isNew 
          ? `El usuario con ID ${value.user_id} no existe en el sistema`
          : 'Perfil no encontrado';
      } else if (err.response?.status === 409 || err.response?.status === 400) {
        errorMsg = err.response.data?.error || `El usuario ${value.user_id} ya tiene un perfil asociado`;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
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
      title={isNew ? 'Crear Nuevo Perfil' : 'Editar Perfil'}
      subtitle="Relación 1:1 - Un usuario solo puede tener un perfil"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, placeholder: 'ID del usuario', disabled: !isNew },
        { name: 'phone', label: 'Teléfono', type: 'text' as const, required: true, placeholder: '+57 300 123 4567' },
        { name: 'photo', label: 'Foto (texto o URL)', type: 'text' as const, required: false, placeholder: 'user_3.jpg o https://…' }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/profiles')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear Perfil' : 'Guardar Cambios'}
    />
  );
};

export default ProfileEdit;
