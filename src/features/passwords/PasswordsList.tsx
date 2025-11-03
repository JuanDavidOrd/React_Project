import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { formatDate } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Password = {
  id: number;
  user_id: number;
  content: string;
  created_at?: string;
};

const PasswordsList: React.FC = () => {
  const [rows, setRows] = useState<Password[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/passwords/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar las contraseñas');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Password) => {
    confirm({
      message: '¿Eliminar este registro de contraseña?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/passwords/${row.id}`);
          showSuccess('Registro de contraseña eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el registro');
        }
      },
    });
  };

  return (
    <GenericList
      title="Historial de Contraseñas"
      subtitle={`${rows.length} registros • Relación 1:N con Usuario`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'user_id', label: 'Usuario', render: (row) => `Usuario #${row.user_id}` },
        { key: 'content', label: 'Hash', render: (row) => (
          <span style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{row.content}</span>
        )},
        { key: 'created_at', label: 'Creado', render: (row) => formatDate(row.created_at) }
      ]}
      onDelete={handleDelete}
      createPath="/passwords/new"
      editPath={(p) => `/passwords/${p.id}`}
      emptyMessage="No hay registros de contraseñas"
    />
  );
};

export default PasswordsList;


