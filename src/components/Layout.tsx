import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import UiLibrarySwitcher from './UiLibrarySwitcher';
import { useUiLibrary } from '../context/UiLibraryContext';
import { LayoutDashboard, Users, FileText, Lock, Shield, LogOut, MapPin, PenTool, Monitor, Key, HelpCircle, MessageSquare, CheckSquare } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { library } = useUiLibrary();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Usuarios', icon: Users },
    { path: '/profiles', label: 'Perfiles', icon: FileText },
    { path: '/sessions', label: 'Sesiones', icon: Lock },
    { path: '/user-roles', label: 'Roles', icon: Shield },
    { path: '/addresses', label: 'Direcciones', icon: MapPin },
    { path: '/digital-signatures', label: 'Firmas', icon: PenTool },
    { path: '/devices', label: 'Dispositivos', icon: Monitor },
    { path: '/passwords', label: 'Contraseñas', icon: Key },
    { path: '/security-questions', label: 'Preguntas', icon: HelpCircle },
    { path: '/answers', label: 'Respuestas', icon: MessageSquare },
    { path: '/roles', label: 'Roles (cat.)', icon: Shield },
    { path: '/permissions', label: 'Permisos', icon: CheckSquare },
    { path: '/role-permissions', label: 'Rol ↔ Permiso', icon: CheckSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const sidebarStyle = library === 'bootstrap'
    ? { width: '260px', background: '#343a40', color: '#fff', display: 'flex', flexDirection: 'column' as const, borderRight: '1px solid #495057', height: '100vh', position: 'fixed' as const, overflow: 'hidden' }
    : library === 'mui'
    ? { width: '280px', background: '#1976d2', color: '#fff', display: 'flex', flexDirection: 'column' as const, borderRight: 'none', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', height: '100vh', position: 'fixed' as const, overflow: 'hidden' }
    : { width: '260px', background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column' as const, borderRight: '1px solid #2a2a2a', height: '100vh', position: 'fixed' as const, overflow: 'hidden' };

  const bgColor = library === 'bootstrap' ? '#f8f9fa' : library === 'mui' ? '#f5f5f5' : '#f5f5f5';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bgColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Logo/Header */}
        <div style={{
          padding: library === 'mui' ? '28px 24px' : '24px 20px',
          borderBottom: library === 'bootstrap' ? '1px solid #495057' : library === 'mui' ? '1px solid rgba(255,255,255,0.12)' : '1px solid #2a2a2a'
        }}>
          <h1 style={{
            fontSize: library === 'mui' ? '22px' : '20px',
            fontWeight: library === 'mui' ? '700' : '600',
            margin: 0,
            letterSpacing: library === 'mui' ? '0.5px' : '-0.5px',
            textTransform: library === 'bootstrap' ? 'uppercase' as const : 'none'
          }}>
            {library === 'bootstrap' ? 'Security' : 'Security System'}
          </h1>
          <p style={{
            fontSize: '12px',
            color: library === 'mui' ? 'rgba(255,255,255,0.7)' : '#888',
            margin: '4px 0 0 0'
          }}>
            Management Panel
          </p>
        </div>

        {/* Navigation */}
        <nav 
          className={library === 'bootstrap' ? 'sidebar-scroll-bootstrap' : library === 'mui' ? 'sidebar-scroll-mui' : 'sidebar-scroll-tailwind'}
          style={{ flex: 1, padding: library === 'mui' ? '24px 0' : '20px 0', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}
        >
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: library === 'mui' ? '14px 24px' : '12px 20px',
                  margin: library === 'mui' ? '4px 16px' : '0',
                  color: active ? '#fff' : (library === 'mui' ? 'rgba(255,255,255,0.7)' : '#888'),
                  textDecoration: 'none',
                  background: active 
                    ? (library === 'bootstrap' ? '#495057' : library === 'mui' ? 'rgba(255,255,255,0.12)' : '#2a2a2a')
                    : 'transparent',
                  borderLeft: library === 'tailwind' ? (active ? '3px solid #fff' : '3px solid transparent') : 'none',
                  borderRadius: library === 'mui' ? '12px' : library === 'bootstrap' ? '4px' : '0',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  fontWeight: active ? '500' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    if (library === 'bootstrap') {
                      e.currentTarget.style.background = '#495057';
                      e.currentTarget.style.color = '#fff';
                    } else if (library === 'mui') {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#fff';
                    } else {
                      e.currentTarget.style.background = '#222';
                      e.currentTarget.style.color = '#fff';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = library === 'mui' ? 'rgba(255,255,255,0.7)' : '#888';
                  }
                }}
              >
                <item.icon 
                  size={library === 'mui' ? 20 : 18} 
                  style={{ marginRight: '12px', flexShrink: 0 }} 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div style={{
          padding: '20px',
          borderTop: library === 'bootstrap' ? '1px solid #495057' : library === 'mui' ? '1px solid rgba(255,255,255,0.12)' : '1px solid #2a2a2a',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.email?.split('@')[0]}
              </div>
              <div style={{
                fontSize: '11px',
                color: library === 'mui' ? 'rgba(255,255,255,0.6)' : '#666',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: library === 'mui' ? '10px' : '8px',
              background: library === 'bootstrap' ? '#dc3545' : library === 'mui' ? 'rgba(255,255,255,0.12)' : '#2a2a2a',
              border: library === 'bootstrap' ? 'none' : library === 'mui' ? 'none' : '1px solid #3a3a3a',
              borderRadius: library === 'mui' ? '12px' : '6px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: library === 'bootstrap' ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (library === 'bootstrap') {
                e.currentTarget.style.background = '#c82333';
              } else if (library === 'mui') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              } else {
                e.currentTarget.style.background = '#3a3a3a';
              }
            }}
            onMouseLeave={(e) => {
              if (library === 'bootstrap') {
                e.currentTarget.style.background = '#dc3545';
              } else if (library === 'mui') {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              } else {
                e.currentTarget.style.background = '#2a2a2a';
              }
            }}
          >
            <LogOut size={14} />
            {library === 'bootstrap' ? 'Salir' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: library === 'mui' ? '280px' : '260px' }}>
        {/* Top Bar */}
        <div style={{
          background: library === 'bootstrap' ? '#f8f9fa' : library === 'mui' ? '#fff' : '#fff',
          borderBottom: library === 'bootstrap' ? '1px solid #dee2e6' : library === 'mui' ? 'none' : '1px solid #e5e5e5',
          padding: library === 'mui' ? '20px 32px' : '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: library === 'mui' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: library === 'mui' ? '28px' : '24px',
              fontWeight: library === 'mui' ? '700' : '600',
              color: library === 'mui' ? '#1976d2' : '#1a1a1a',
              letterSpacing: library === 'bootstrap' ? '0' : '-0.5px',
              textTransform: library === 'bootstrap' ? 'uppercase' as const : 'none'
            }}>
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UiLibrarySwitcher />
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

