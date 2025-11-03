import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Permission = {
  id: number;
  entity: string;
  method: string;
  url: string;
};

const PermissionsList: React.FC = () => {
  const [rows, setRows] = useState<Permission[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/permissions/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar los permisos');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Permission) => {
    confirm({
      message: '¿Eliminar este permiso?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/permissions/${row.id}`);
          showSuccess('Permiso eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el permiso');
        }
      },
    });
  };

  return (
    <GenericList
      title="Permisos"
      subtitle={`${rows.length} ${rows.length === 1 ? 'permiso' : 'permisos'} • Reglas API (Entidad, Método, URL)`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'entity', label: 'Entidad' },
        { key: 'method', label: 'Método' },
        { key: 'url', label: 'URL', render: (row) => (
          <span style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{row.url}</span>
        ) }
      ]}
      onDelete={handleDelete}
      createPath="/permissions/new"
      editPath={(p) => `/permissions/${p.id}`}
      emptyMessage="No hay permisos registrados"
    />
  );
};

export default PermissionsList;


