import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../lib/api";
import GenericList from "../../components/generic/GenericList";
import { formatDate } from "../../utils/dateFormatter";
import { useNotifications } from "../../utils/notifications";
import { useConfirm } from "../../utils/confirmDialog";

type Profile = {
  id: number;
  user_id: number;
  phone: string;
  photo: string;        // en BD: "profiles/<uuid>_archivo.png" (ruta relativa)
  created_at?: string;
  updated_at?: string;
};

const ProfilesList: React.FC = () => {
  const [rows, setRows] = useState<Profile[]>([]);
  const { showError, showSuccess } = useNotifications();
  const { confirm } = useConfirm();

  const load = async () => {
    try {
      const { data } = await apiClient.get("/api/profiles/");
      setRows(data);
    } catch {
      showError("Error al cargar los perfiles");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (row: Profile) => {
    confirm({
      message: "¿Eliminar este perfil?",
      onConfirm: async () => {
        try {
          await apiClient.delete(`/api/profiles/${row.id}`);
          showSuccess("Perfil eliminado correctamente");
          await load();
        } catch {
          showError("Error al eliminar el perfil");
        }
      },
    });
  };

  const renderThumb = (row: Profile) => {
    const filenameOnly = row.photo ? row.photo.split("/").pop() : "";
    const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
    const url = filenameOnly ? `${base}/api/profiles/${filenameOnly}` : "";

    return url ? (
      <img
        src={url}
        alt="avatar"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid #e5e5e5",
        }}
      />
    ) : (
      <span style={{ color: "#888" }}>—</span>
    );
  };

  return (
    <GenericList
      title="Perfiles de Usuario"
      subtitle={`${rows.length} ${rows.length === 1 ? "perfil" : "perfiles"} • Relación 1:1 con Usuario`}
      data={rows}
      columns={[
        {
          key: "id",
          label: "ID",
          render: (row) => (
            <Link
              to={`/profile/${row.id}`}
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              #{row.id}
            </Link>
          ),
        },
        {
          key: "user_id",
          label: "ID Usuario",
          render: (row) => (
            <Link
              to={`/profile/${row.id}`}
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Usuario #{row.user_id}
            </Link>
          ),
        },
        { key: "phone", label: "Teléfono" },
        { key: "photo", label: "Foto", render: renderThumb },
        { key: "created_at", label: "Creado", render: (row) => formatDate(row.created_at) },
        { key: "updated_at", label: "Actualizado", render: (row) => formatDate(row.updated_at) },
      ]}
      onDelete={handleDelete}
      createPath="/profiles/new"
      editPath={(p) => `/profiles/${p.id}`}
      emptyMessage="No hay perfiles registrados"
    />
  );
};

export default ProfilesList;
