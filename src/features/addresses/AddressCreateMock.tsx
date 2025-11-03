import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import apiClient from '../../lib/api';
import { useUiLibrary } from '../../context/UiLibraryContext';
import { useNotifications } from '../../utils/notifications';

type AddressInput = {
  user_id: string;
  street: string;
  number: string;
  latitude?: string;
  longitude?: string;
};

const AddressCreateMock: React.FC = () => {
  const navigate = useNavigate();
  const { library } = useUiLibrary();
  const [value, setValue] = useState<AddressInput>({ user_id: '', street: '', number: '', latitude: '', longitude: '' });
  const { showError, showSuccess } = useNotifications();

  const save = async () => {
    try {
      await apiClient.post(`/api/addresses/user/${value.user_id}`, { street: value.street, number: value.number, latitude: value.latitude, longitude: value.longitude });
      showSuccess('Dirección creada correctamente');
      navigate('/addresses');
    } catch {
      showError('Error al crear la dirección');
    }
  };

  const cardStyle = library === 'bootstrap'
    ? {
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }
    : library === 'mui'
    ? {
        background: '#fff',
        border: 'none',
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }
    : { background: '#fff', border: '2px solid #e5e5e5', borderRadius: 12 };

  const inputStyle = {
    width: '100%',
    padding: library === 'mui' ? '14px' : '12px',
    fontSize: library === 'mui' ? '15px' : '14px',
    border: library === 'bootstrap' ? '1px solid #ced4da' : library === 'mui' ? '1px solid #c4c4c4' : '1px solid #e5e5e5',
    borderRadius: library === 'mui' ? 4 : library === 'bootstrap' ? 4 : 8,
    boxShadow: library === 'bootstrap' ? 'inset 0 1px 2px rgba(0,0,0,0.05)' : 'none',
    background: '#fff'
  } as React.CSSProperties;

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: library === 'mui' ? 12 : 13,
    fontWeight: library === 'bootstrap' ? 600 : 500,
    textTransform: library === 'bootstrap' ? 'none' as const : library === 'mui' ? 'uppercase' as const : 'none' as const,
    letterSpacing: library === 'mui' ? '0.4px' : 'normal',
    color: library === 'mui' ? '#616161' : '#1a1a1a'
  } as React.CSSProperties;

  const buttonStyle = {
    padding: library === 'mui' ? '12px 28px' : '10px 24px',
    minWidth: 220,
    border: 'none',
    borderRadius: library === 'mui' ? 24 : library === 'bootstrap' ? 6 : 8,
    background: library === 'bootstrap' ? '#28a745' : library === 'mui' ? '#1976d2' : '#111827',
    color: '#fff',
    fontWeight: library === 'bootstrap' ? 600 : 500,
    textTransform: library === 'mui' ? 'uppercase' as const : 'none' as const,
    letterSpacing: library === 'mui' ? '0.5px' : 'normal',
    boxShadow: library === 'bootstrap' ? '0 .125rem .25rem rgba(0,0,0,.075)' : library === 'mui' ? '0 3px 5px rgba(25,118,210,.3)' : 'none',
    cursor: 'pointer'
  } as React.CSSProperties;

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ ...cardStyle, padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Crear Dirección</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', alignItems: 'start' }}>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
              {/* Ejemplo: usa un iframe simple de Google Maps o una imagen estática */}
              <iframe
                title="Mapa"
                src="https://maps.google.com/maps?q=bogota&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ width: '100%', height: '260px', border: 0 }}
              />
            </div>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Calle</label>
                <input value={value.street} placeholder="Ej: Av. Siempre Viva" onChange={(e) => setValue({ ...value, street: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Número</label>
                <input value={value.number} placeholder="Ej: 742" onChange={(e) => setValue({ ...value, number: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Latitud</label>
                  <input value={value.latitude} placeholder="4.7110" onChange={(e) => setValue({ ...value, latitude: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Longitud</label>
                  <input value={value.longitude} placeholder="-74.0721" onChange={(e) => setValue({ ...value, longitude: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Usuario ID</label>
                <input type="number" value={value.user_id} placeholder="ID del usuario" onChange={(e) => setValue({ ...value, user_id: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={save}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    if (library === 'bootstrap') e.currentTarget.style.background = '#218838';
                    else if (library === 'mui') e.currentTarget.style.background = '#1565c0';
                    else e.currentTarget.style.background = '#0b1220';
                  }}
                  onMouseLeave={(e) => {
                    if (library === 'bootstrap') e.currentTarget.style.background = '#28a745';
                    else if (library === 'mui') e.currentTarget.style.background = '#1976d2';
                    else e.currentTarget.style.background = '#111827';
                  }}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddressCreateMock;


