import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericDetailView from '../../components/generic/GenericDetailView';
import { formatDate } from '../../utils/dateFormatter';
import { useNotifications } from '../../utils/notifications';

type ProfileData = {
  id: number;
  user_id: number;
  phone?: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
};

const ProfileView: React.FC = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotifications();

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const { data: p } = await apiClient.get(`/api/profiles/${id}`);
        setProfile(p);
        if (p?.user_id) {
          const { data: u } = await apiClient.get(`/api/users/${p.user_id}`);
          setUser({ name: u.name, email: u.email });
        }
      } catch (err: any) {
        showError(err.response?.data?.error || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, showError]);

  if (loading || !profile || !user) {
    return (
      <GenericDetailView
        title="Cargando..."
        fields={[]}
        imageFallback="Loading"
      />
    );
  }

  return (
    <GenericDetailView
      title="Perfil de Usuario"
      subtitle={user.name}
      imageUrl={profile.photo || undefined}
      imageFallback={user.name}
      fields={[
        { label: 'Nombre', value: user.name },
        { label: 'Email', value: user.email },
        { label: 'Teléfono', value: profile.phone || '-' },
        { label: 'Creado', value: formatDate(profile.created_at) },
        { label: 'Actualizado', value: formatDate(profile.updated_at) }
      ]}
      editPath={`/profile/update/${id}`}
      backPath="/profiles"
      backLabel="Volver a Perfiles"
    />
  );
};

export default ProfileView;


