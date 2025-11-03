import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Role = {
  id: number;
  name: string;
  description?: string;
};

const RolesList: React.FC = () => {
  const [rows, setRows] = useState<Role[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/roles/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar los roles');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Role) => {
    confirm({
      message: '¿Eliminar este rol?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/roles/${row.id}`);
          showSuccess('Rol eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el rol');
        }
      },
    });
  };

  return (
    <GenericList
      title="Roles"
      subtitle={`${rows.length} ${rows.length === 1 ? 'rol' : 'roles'}`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' }
      ]}
      onDelete={handleDelete}
      createPath="/roles/new"
      editPath={(r) => `/roles/${r.id}`}
      emptyMessage="No hay roles registrados"
    />
  );
};

export default RolesList;


