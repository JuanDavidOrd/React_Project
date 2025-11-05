import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type SecurityQuestionInput = {
  name: string;
  description?: string;
};

const SecurityQuestionEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<SecurityQuestionInput>({ name: '', description: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/security-questions/${id}`);
          setValue({ name: data.name || '', description: data.description || '' });
        } catch {
          showError('Error al cargar la pregunta');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      if (isNew) {
        await apiClient.post('/api/security-questions/', value);
        showSuccess('Pregunta de seguridad creada correctamente');
      } else {
        await apiClient.put(`/api/security-questions/${id}`, value);
        showSuccess('Pregunta de seguridad actualizada correctamente');
      }
      navigate('/security-questions');
    } catch {
      showError('Error al guardar la pregunta');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Pregunta' : 'Editar Pregunta'}
      subtitle="Preguntas de seguridad"
      fields={[
        { name: 'name', label: 'Pregunta', type: 'text' as const, required: true },
        { name: 'description', label: 'Descripción', type: 'text' as const, required: false },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/security-questions')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default SecurityQuestionEdit;


