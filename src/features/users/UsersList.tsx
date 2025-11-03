import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type User = {
  id: number;
  name: string;
  email: string;
};

const UsersList: React.FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/api/users/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: User) => {
    confirm({
      message: `¿Eliminar usuario ${row.name}?`,
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/users/${row.id}`);
          showSuccess('Usuario eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el usuario');
        }
      },
    });
  };

  return (
    <GenericList
      title="Lista de Usuarios"
      subtitle={`${rows.length} ${rows.length === 1 ? 'usuario' : 'usuarios'}`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'name', label: 'Nombre' },
        { key: 'email', label: 'Email' }
      ]}
      onDelete={handleDelete}
      createPath="/users/new"
      editPath={(user) => `/users/${user.id}`}
      emptyMessage="No hay usuarios registrados"
    />
  );
};

export default UsersList;
