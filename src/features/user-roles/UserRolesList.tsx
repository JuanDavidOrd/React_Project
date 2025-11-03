import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { formatDateOnly } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type UserRole = {
  id: string;
  user_id: number;
  role_id: number;
  startAt: string;
  endAt?: string;
};

const UserRolesList: React.FC = () => {
  const [rows, setRows] = useState<UserRole[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/user-roles/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar las asignaciones de roles');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: UserRole) => {
    confirm({
      message: '¿Eliminar esta asignación usuario-rol?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/user-roles/${row.id}`);
          showSuccess('Asignación eliminada correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar la asignación');
        }
      },
    });
  };

  return (
    <GenericList
      title="Asignación de Roles"
      subtitle={`${rows.length} ${rows.length === 1 ? 'asignación' : 'asignaciones'} • Relación N:N entre Usuarios y Roles`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => (
          <span style={{ fontFamily: 'monospace' }}>{row.id.substring(0, 8)}...</span>
        )},
        { key: 'user_id', label: 'Usuario', render: (row) => `Usuario #${row.user_id}` },
        { key: 'role_id', label: 'Rol', render: (row) => `Rol #${row.role_id}` },
        { key: 'startAt', label: 'Inicio', render: (row) => formatDateOnly(row.startAt) },
        { key: 'endAt', label: 'Fin', render: (row) => formatDateOnly(row.endAt) }
      ]}
      onDelete={handleDelete}
      createPath="/user-roles/new"
      editPath={(userRole) => `/user-roles/${userRole.id}`}
      emptyMessage="No hay asignaciones de roles"
    />
  );
};

export default UserRolesList;
