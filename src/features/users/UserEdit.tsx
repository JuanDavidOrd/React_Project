import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { validateRequired, validateEmail } from '../../utils/formValidation';
import { useNotifications } from '../../utils/notifications';

type UserInput = {
  name: string;
  email: string;
};

const UserEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<UserInput>({ name: '', email: '' });
  const { showError, showSuccess, showWarning } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/users/${id}`);
          setValue({ name: data.name, email: data.email });
        } catch (err) {
          showError('Error al cargar el usuario');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    // Validaciones
    if (!validateRequired(value.name)) {
      showWarning('El nombre es obligatorio');
      return;
    }
    if (!validateRequired(value.email)) {
      showWarning('El correo electrónico es obligatorio');
      return;
    }
    if (!validateEmail(value.email)) {
      showWarning('El correo electrónico no es válido');
      return;
    }

    try {
      if (isNew) {
        await apiClient.post('/api/users/', value);
        showSuccess('Usuario creado correctamente');
      } else {
        await apiClient.put(`/api/users/${id}`, value);
        showSuccess('Usuario actualizado correctamente');
      }
      navigate('/users');
    } catch (err: any) {
      let errorMsg = 'Error al guardar';
      if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Datos inválidos';
      } else if (err.response?.status === 409) {
        errorMsg = 'El correo electrónico ya está en uso';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      showError(errorMsg);
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
      subtitle={isNew ? 'Ingresa los datos del nuevo usuario' : 'Modifica la información del usuario'}
      fields={[
        { name: 'name', label: 'Nombre completo', type: 'text' as const, required: true, placeholder: 'Ingresa el nombre completo' },
        { name: 'email', label: 'Correo electrónico', type: 'email' as const, required: true, placeholder: 'usuario@ejemplo.com' }
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/users')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear Usuario' : 'Guardar Cambios'}
    />
  );
};

export default UserEdit;
