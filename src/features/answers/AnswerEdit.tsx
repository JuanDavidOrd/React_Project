import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';

type AnswerInput = {
  user_id: string;
  security_question_id: string;
  content: string;
};

const AnswerEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [value, setValue] = useState<AnswerInput>({ user_id: '', security_question_id: '', content: '' });
  const { showError, showSuccess } = useNotifications();

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/answers/${id}`);
          setValue({ user_id: String(data.user_id), security_question_id: String(data.security_question_id), content: data.content || '' });
        } catch {
          showError('Error al cargar la respuesta');
        }
      })();
    }
  }, [id, isNew, showError]);

  const save = async () => {
    try {
      const payload = { content: value.content };
      if (isNew) {
        await apiClient.post(`/api/answers/user/${value.user_id}/question/${value.security_question_id}`, payload);
        showSuccess('Respuesta creada correctamente');
      } else {
        await apiClient.put(`/api/answers/${id}`, payload);
        showSuccess('Respuesta actualizada correctamente');
      }
      navigate('/answers');
    } catch {
      showError('Error al guardar la respuesta');
    }
  };

  return (
    <GenericForm
      title={isNew ? 'Crear Respuesta' : 'Editar Respuesta'}
      subtitle="N:N Usuarios ↔ Preguntas"
      fields={[
        { name: 'user_id', label: 'Usuario ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'security_question_id', label: 'Pregunta ID', type: 'number' as const, required: true, disabled: !isNew },
        { name: 'content', label: 'Respuesta', type: 'text' as const, required: true },
      ]}
      value={value}
      onChange={setValue}
      onSubmit={save}
      onCancel={() => navigate('/answers')}
      isNew={isNew}
      submitLabel={isNew ? 'Crear' : 'Guardar Cambios'}
    />
  );
};

export default AnswerEdit;


