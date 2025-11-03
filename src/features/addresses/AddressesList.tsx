import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { formatDate } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Address = {
  id: number;
  user_id: number;
  street: string;
  number: string;
  latitude?: number;
  longitude?: number;
};

const AddressesList: React.FC = () => {
  const [rows, setRows] = useState<Address[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/addresses/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar las direcciones');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Address) => {
    confirm({
      message: '¿Eliminar esta dirección?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/addresses/${row.id}`);
          showSuccess('Dirección eliminada correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar la dirección');
        }
      },
    });
  };

  return (
    <GenericList
      title="Direcciones"
      subtitle={`${rows.length} ${rows.length === 1 ? 'dirección' : 'direcciones'} • Relación 1:1 con Usuario`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'user_id', label: 'ID Usuario', render: (row) => `Usuario #${row.user_id}` },
        { key: 'street', label: 'Calle' },
        { key: 'number', label: 'Número' },
        { key: 'latitude', label: 'Latitud', render: (row) => row.latitude ?? '-' },
        { key: 'longitude', label: 'Longitud', render: (row) => row.longitude ?? '-' }
      ]}
      onDelete={handleDelete}
      createPath="/addresses/create"
      editPath={(address) => `/addresses/${address.id}`}
      emptyMessage="No hay direcciones registradas"
    />
  );
};

export default AddressesList;


