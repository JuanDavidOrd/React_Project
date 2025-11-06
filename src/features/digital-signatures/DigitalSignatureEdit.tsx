import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../lib/api';
import GenericForm from '../../components/generic/GenericForm';
import { useNotifications } from '../../utils/notifications';
import { useUiLibrary } from '../../context/UiLibraryContext';

type DigitalSignatureInput = {
  user_id: string;
  photoFile: File | null;
  preview: string;
};

const MAX_MB = 3;
const ACCEPT = 'image/png,image/jpeg,image/jpg';

const DigitalSignatureEdit: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNew = !id || id === 'new';

  const navigate = useNavigate();
  const { showError, showSuccess, showWarning } = useNotifications();
  const { library } = useUiLibrary();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState<DigitalSignatureInput>({
    user_id: '',
    photoFile: null,
    preview: '',
  });

  const apiBase = useMemo(
    () => (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:5000',
    []
  );

  const buildPreviewUrl = (photoPath?: string): string => {
    if (!photoPath) return '';
    const filenameOnly = photoPath.split('/').pop() || '';
    return filenameOnly ? `${apiBase}/api/digital-signatures/${filenameOnly}` : '';
  };

  useEffect(() => {
    if (isNew) {
      setValue({ user_id: '', photoFile: null, preview: '' });
      return;
    }
    (async () => {
      try {
        const { data } = await apiClient.get(`/api/digital-signatures/${id}`);
        setValue(v => ({
          ...v,
          user_id: String(data?.user_id ?? ''),
          photoFile: null,
          preview: buildPreviewUrl(data?.photo),
        }));
      } catch {
        showError('Error al cargar la firma');
      }
    })();
  }, [id, isNew, location.pathname, showError]);

  // Limpia el objeto URL cuando cambia el archivo
  useEffect(() => {
    return () => {
      if (value.preview?.startsWith('blob:')) URL.revokeObjectURL(value.preview);
    };

  }, [value.photoFile]);

  const validateAndSet = (file: File | null) => {
    if (!file) {
      setValue(v => ({ ...v, photoFile: null, preview: v.preview }));
      return;
    }
    if (!ACCEPT.split(',').includes(file.type)) {
      showWarning('Solo se permiten imágenes PNG o JPG');
      return;
    }
    const maxBytes = MAX_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      showWarning(`La imagen no debe superar ${MAX_MB} MB`);
      return;
    }
    setValue(v => ({
      ...v,
      photoFile: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    validateAndSet(file);
  };

  const openPicker = () => inputRef.current?.click();

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = '';
    setValue(v => ({ ...v, photoFile: null, preview: '' }));
  };

  const save = async () => {
    try {
      if (isNew && !value.user_id.trim()) {
        showWarning('El Usuario ID es obligatorio');
        return;
      }
      if (!value.photoFile) {
        showWarning('Debes seleccionar una imagen (PNG/JPG)');
        return;
      }
      const form = new FormData();
      form.append('photo', value.photoFile);

      if (isNew) {
        await apiClient.post(`/api/digital-signatures/user/${value.user_id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Firma digital creada correctamente');
      } else {
        await apiClient.put(`/api/digital-signatures/${id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Firma digital actualizada correctamente');
      }
      navigate('/digital-signatures');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Error al guardar la firma';
      showError(msg);
    }
  };

  // ---------- Bloques UI bonitos por librería ----------
  const TailwindUpload = () => (
    <div className="max-w-xl mt-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Archivo de imagen (PNG/JPG)
      </label>

      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition cursor-pointer bg-white"
        onClick={openPicker}
      >
        <p className="text-sm text-gray-600">
          Arrastra y suelta la imagen aquí, o <span className="font-semibold">haz clic para elegir</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">Máximo {MAX_MB} MB • PNG o JPG</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFileChange}
        className="hidden"
      />

      {value.preview && (
        <div className="mt-4 flex items-start gap-4">
          <img
            src={value.preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded-lg border border-gray-200"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={clearFile}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Limpiar imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const BootstrapUpload = () => (
    <div style={{ maxWidth: 720, marginTop: 12 }}>
      <label className="form-label fw-semibold">Archivo de imagen (PNG/JPG)</label>

      <div
        className="border border-2 border-secondary-subtle rounded-4 p-4 text-center bg-white"
        style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        onClick={openPicker}
      >
        <div className="text-muted">
          Arrastra y suelta la imagen aquí, o <strong>haz clic para elegir</strong>
        </div>
        <div className="small text-muted mt-1">Máximo {MAX_MB} MB • PNG o JPG</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFileChange}
        className="form-control mt-3"
      />

      {value.preview && (
        <div className="d-flex align-items-start gap-3 mt-3">
          <img
            src={value.preview}
            alt="preview"
            className="rounded-3 border"
            style={{ width: 160, height: 160, objectFit: 'cover' }}
          />
          <button type="button" className="btn btn-outline-secondary" onClick={clearFile}>
            Limpiar imagen
          </button>
        </div>
      )}
    </div>
  );

  const MUIUpload = () => (
    <div style={{ maxWidth: 720, marginTop: 12 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
        Archivo de imagen (PNG/JPG)
      </label>

      <div
        onClick={openPicker}
        style={{
          border: '2px dashed #cfcfcf',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
          cursor: 'pointer',
          background: '#fff',
        }}
      >
        <div style={{ color: '#555' }}>
          Arrastra y suelta la imagen aquí, o <strong>haz clic para elegir</strong>
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          Máximo {MAX_MB} MB • PNG o JPG
        </div>
      </div>

      <input ref={inputRef} type="file" accept={ACCEPT} onChange={onFileChange} style={{ display: 'none' }} />

      {value.preview && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 12 }}>
          <img
            src={value.preview}
            alt="preview"
            style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid #eee' }}
          />
          <button
            type="button"
            onClick={clearFile}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #ddd',
              background: '#fff',
            }}
          >
            Limpiar imagen
          </button>
        </div>
      )}
    </div>
  );

  // Bloque debajo del formulario
  const UploadBlock = library === 'tailwind' ? (
    <TailwindUpload />
  ) : library === 'bootstrap' ? (
    <BootstrapUpload />
  ) : (
    <MUIUpload />
  );

  const genericFormProps: any = {
    title: isNew ? 'Crear Firma Digital' : 'Editar Firma Digital',
    subtitle: '1:1 - Firma por usuario (sube un archivo de imagen)',
    fields: [
      {
        name: 'user_id',
        label: 'Usuario ID',
        type: 'number' as const,
        required: true,
        disabled: !isNew,
      },
    ],
    value: { user_id: value.user_id },
    onChange: (partial: any) =>
      setValue(v => ({ ...v, user_id: String(partial.user_id ?? v.user_id) })),
    onSubmit: save,
    onCancel: () => navigate('/digital-signatures'),
    isNew,
    submitLabel: isNew ? 'Crear' : 'Guardar Cambios',
    extraBelowFields: UploadBlock,
  };

  return (
    <>
      <GenericForm {...genericFormProps} />
      {/* Aquie un fallback por si el GenericForm no soporta extraBelowFields */}
      {!('propTypes' in (GenericForm as any) && 'extraBelowFields' in (GenericForm as any).propTypes) && (
        <div style={{ maxWidth: 720 }}>{UploadBlock}</div>
      )}
    </>
  );
};

export default DigitalSignatureEdit;
