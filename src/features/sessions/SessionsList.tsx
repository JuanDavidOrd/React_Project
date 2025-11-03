import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { formatDate } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Session = {
  id: string;
  user_id: number;
  token: string;
  expiration: string;
  state: string;
};

const SessionsList: React.FC = () => {
  const [rows, setRows] = useState<Session[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/sessions/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar las sesiones');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Session) => {
    confirm({
      message: '¿Eliminar esta sesión?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/sessions/${row.id}`);
          showSuccess('Sesión eliminada correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar la sesión');
        }
      },
    });
  };

  return (
    <GenericList
      title="Sesiones Activas"
      subtitle={`${rows.length} ${rows.length === 1 ? 'sesión' : 'sesiones'} • Relación 1:N con Usuario`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => (
          <span style={{ fontFamily: 'monospace' }}>{row.id.substring(0, 8)}...</span>
        )},
        { key: 'user_id', label: 'Usuario', render: (row) => `Usuario #${row.user_id}` },
        { key: 'token', label: 'Token', render: (row) => (
          <span style={{ fontFamily: 'monospace', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {row.token}
          </span>
        )},
        { key: 'expiration', label: 'Expiración', render: (row) => formatDate(row.expiration) },
        { key: 'state', label: 'Estado', render: (row) => (
          <span style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            background: row.state === 'active' ? '#e6f7e6' : '#ffe6e6',
            color: row.state === 'active' ? '#006600' : '#cc0000'
          }}>
            {row.state}
          </span>
        )}
      ]}
      onDelete={handleDelete}
      createPath="/sessions/new"
      editPath={(session) => `/sessions/${session.id}`}
      emptyMessage="No hay sesiones registradas"
    />
  );
};

export default SessionsList;
