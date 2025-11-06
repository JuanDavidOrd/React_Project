// src/features/profiles/ProfileEdit.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../lib/api";
import GenericForm from "../../components/generic/GenericForm";
import { useNotifications } from "../../utils/notifications";

type ProfileInput = {
  user_id: string;
  phone: string;
  photoFile: File | null;   // archivo seleccionado
  preview: string;          // vista previa (blob URL o URL del backend)
};

const ProfileEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { showError, showSuccess, showWarning } = useNotifications();

  const [value, setValue] = useState<ProfileInput>({
    user_id: "",
    phone: "",
    photoFile: null,
    preview: "",
  });

  // Igual que Firmas: construir URL absoluta al backend para ver la imagen guardada
  const buildPreviewUrl = (photoPath?: string): string => {
    if (!photoPath) return "";
    // En DB: "profiles/<uuid>_nombre.png"
    const filenameOnly = photoPath.split("/").pop() || "";
    const base = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
    return filenameOnly ? `${base}/api/profiles/${filenameOnly}` : "";
  };

  useEffect(() => {
    if (!isNew && id) {
      (async () => {
        try {
          const { data } = await apiClient.get(`/api/profiles/${id}`);
          setValue((v) => ({
            ...v,
            user_id: String(data.user_id ?? ""),
            phone: data.phone ?? "",
            photoFile: null,
            preview: buildPreviewUrl(data.photo),
          }));
        } catch {
          showError("Error al cargar el perfil");
        }
      })();
    }
  }, [id, isNew, showError]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue((v) => ({
      ...v,
      photoFile: file,
      preview: file ? URL.createObjectURL(file) : v.preview,
    }));
  };

  const save = async () => {
    // Validaciones mínimas (como en Firmas)
    if (!value.phone.trim()) {
      showWarning("El teléfono es obligatorio");
      return;
    }
    if (isNew && !value.user_id.trim()) {
      showWarning("El Usuario ID es obligatorio");
      return;
    }
    // Tu backend de perfiles acepta foto opcional; si quieres forzarla, descomenta:
    // if (!value.photoFile) { showWarning("Debes seleccionar una imagen (PNG/JPG)"); return; }

    try {
      const form = new FormData();
      form.append("phone", value.phone.trim());
      if (value.photoFile) form.append("photo", value.photoFile); // CLAVE: 'photo' (igual que en backend)

      if (isNew) {
        const { data } = await apiClient.post(
          `/api/profiles/user/${value.user_id}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showSuccess("Perfil creado correctamente");
        const newId = data?.id ?? data?.profile?.id;
        navigate(`/profiles/${newId}`);
      } else {
        await apiClient.put(`/api/profiles/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showSuccess("Perfil actualizado correctamente");
        navigate(`/profiles/${id}`);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Error al guardar el perfil";
      showError(msg);
    }
  };

  // Bloque de archivo y preview, INYECTADO como en Firmas (si ya agregaste soporte a GenericForm)
  const FileBlock = (
    <div style={{ marginTop: 12 }}>
      <label
        style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}
      >
        Foto de perfil (PNG/JPG)
      </label>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {value.preview ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
            Vista previa:
          </div>
          <img
            src={value.preview}
            alt="preview"
            style={{
              width: 160,
              height: 160,
              objectFit: "cover",
              borderRadius: "50%",
              border: "1px solid #eee",
            }}
          />
        </div>
      ) : null}
    </div>
  );

  // Si tu GenericForm NO soporta `extraBelowFields`, puedes dejarlo vacío y el FileBlock igual se muestra
  // porque lo renderizamos aquí debajo del formulario en el JSX (fallback).
  const genericFormProps: any = {
    title: isNew ? "Crear Nuevo Perfil" : "Editar Perfil",
    subtitle: "Relación 1:1 - Un usuario solo puede tener un perfil",
    fields: [
      {
        name: "user_id",
        label: "Usuario ID",
        type: "number",
        required: true,
        placeholder: "ID del usuario",
        disabled: !isNew,
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "text",
        required: true,
        placeholder: "+57 300 123 4567",
      },
    ],
    value: { user_id: value.user_id, phone: value.phone },
    onChange: (partial: any) =>
      setValue((v) => ({
        ...v,
        user_id:
          partial.user_id !== undefined ? String(partial.user_id) : v.user_id,
        phone: partial.phone !== undefined ? partial.phone : v.phone,
      })),
    onSubmit: save,
    onCancel: () => navigate("/profiles"),
    isNew,
    submitLabel: isNew ? "Crear Perfil" : "Guardar Cambios",
    // si tu GenericForm ya admite esto (lo usaste en Firmas), se mostrará dentro del form:
    extraBelowFields: FileBlock,
  };

  return (
    <>
      <GenericForm {...genericFormProps} />
      {/* Fallback por si tu GenericForm todavía NO tiene la prop extraBelowFields */}
      {FileBlock}
    </>
  );
};

export default ProfileEdit;
