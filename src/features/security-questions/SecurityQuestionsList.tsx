import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type SecurityQuestion = {
  id: number;
  name: string;
  description?: string;
};

const SecurityQuestionsList: React.FC = () => {
  const [rows, setRows] = useState<SecurityQuestion[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/security-questions/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar las preguntas de seguridad');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: SecurityQuestion) => {
    confirm({
      message: '¿Eliminar esta pregunta de seguridad?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/security-questions/${row.id}`);
          showSuccess('Pregunta de seguridad eliminada correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar la pregunta');
        }
      },
    });
  };

  return (
    <GenericList
      title="Preguntas de Seguridad"
      subtitle={`${rows.length} ${rows.length === 1 ? 'pregunta' : 'preguntas'}`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'name', label: 'Pregunta' },
        { key: 'description', label: 'Descripción' }
      ]}
      onDelete={handleDelete}
      createPath="/security-questions/new"
      editPath={(q) => `/security-questions/${q.id}`}
      emptyMessage="No hay preguntas registradas"
    />
  );
};

export default SecurityQuestionsList;


