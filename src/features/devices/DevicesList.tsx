import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import GenericList from '../../components/generic/GenericList';
import { useNotifications } from '../../utils/notifications';
import { useConfirm } from '../../utils/confirmDialog';

type Device = {
  id: number;
  user_id: number;
  name: string;
  ip: string;
  operating_system?: string;
};

const DevicesList: React.FC = () => {
  const [rows, setRows] = useState<Device[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get('/api/devices/');
      setRows(data);
    } catch (err) {
      showError('Error al cargar los dispositivos');
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row: Device) => {
    confirm({
      message: '¿Eliminar este dispositivo?',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/devices/${row.id}`);
          showSuccess('Dispositivo eliminado correctamente');
          await load();
        } catch (err) {
          showError('Error al eliminar el dispositivo');
        }
      },
    });
  };

  return (
    <GenericList
      title="Dispositivos"
      subtitle={`${rows.length} ${rows.length === 1 ? 'dispositivo' : 'dispositivos'} • Relación 1:N con Usuario`}
      data={rows}
      columns={[
        { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
        { key: 'user_id', label: 'Usuario', render: (row) => `Usuario #${row.user_id}` },
        { key: 'name', label: 'Nombre' },
        { key: 'ip', label: 'IP' },
        { key: 'operating_system', label: 'SO' }
      ]}
      onDelete={handleDelete}
      createPath="/devices/new"
      editPath={(d) => `/devices/${d.id}`}
      emptyMessage="No hay dispositivos registrados"
    />
  );
};

export default DevicesList;


