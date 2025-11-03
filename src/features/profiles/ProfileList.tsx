import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { formatDate } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Profile = {
  id: number;
  user_id: number;
  phone: string;
  photo: string;
  created_at?: string;
  updated_at?: string;
};

const ProfilesList: React.FC = () => {
  const [rows, setRows] = useState<Profile[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/profiles/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar los perfiles');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Profile) => {
    confirm({
      message: '¿Eliminar este perfil?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/profiles/${row.id}`);
          showSuccess('Perfil eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el perfil');
        }
      },
    });
  };

  return (
    <GenericList
      title="Perfiles de Usuario"
      subtitle={`${rows.length} ${rows.length === 1 ? 'perfil' : 'perfiles'} • Relación 1:1 con Usuario`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => (<Link to={`/profile/${row.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>#{row.id}</Link>) },
        { key: 'user_id', label: 'ID Usuario', render: (row) => (<Link to={`/profile/${row.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>Usuario #{row.user_id}</Link>) },
        { key: 'phone', label: 'Teléfono' },
        { key: 'photo', label: 'Foto', render: (row) => (
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {row.photo}
          </span>
        )},
        { key: 'created_at', label: 'Creado', render: (row) => formatDate(row.created_at) },
        { key: 'updated_at', label: 'Actualizado', render: (row) => formatDate(row.updated_at) }
      ]}
      onDelete={handleDelete}
      createPath="/profiles/new"
      editPath={(profile) => `/profiles/${profile.id}`}
      emptyMessage="No hay perfiles registrados"
    />
  );
};

export default ProfilesList;
