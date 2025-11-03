import React, { createContext, useContext, useState, useCallback } from 'react';
import { useUiLibrary } from '../context/UiLibraryContext';
import { Alert, Snackbar } from '@mui/material';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

type NotificationContextValue = {
  showNotification: (message: string, type?: NotificationType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { library } = useUiLibrary();

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  const showSuccess = useCallback((message: string) => showNotification(message, 'success'), [showNotification]);
  const showError = useCallback((message: string) => showNotification(message, 'error'), [showNotification]);
  const showInfo = useCallback((message: string) => showNotification(message, 'info'), [showNotification]);
  const showWarning = useCallback((message: string) => showNotification(message, 'warning'), [showNotification]);

  const renderTailwindNotification = (notification: Notification) => {
    const colors = {
      success: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', icon: '✓' },
      error: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: '✕' },
      info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', icon: 'ℹ' },
      warning: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-800', icon: '⚠' },
    };
    const color = colors[notification.type];

    return (
      <div
        key={notification.id}
        onClick={() => removeNotification(notification.id)}
        className={`${color.bg} ${color.border} ${color.text} border-2 rounded-lg p-3 shadow-lg cursor-pointer flex items-center gap-3 font-medium animate-slide-in-right max-w-md`}
      >
        <span className="text-lg font-bold">{color.icon}</span>
        <span className="flex-1">{notification.message}</span>
      </div>
    );
  };

  const renderBootstrapNotification = (notification: Notification) => {
    const alertTypes = {
      success: 'alert-success',
      error: 'alert-danger',
      info: 'alert-info',
      warning: 'alert-warning',
    };

    return (
      <div
        key={notification.id}
        className={`alert ${alertTypes[notification.type]} alert-dismissible fade show d-flex align-items-center gap-2`}
        role="alert"
        style={{ cursor: 'pointer', maxWidth: '400px' }}
        onClick={() => removeNotification(notification.id)}
      >
        <strong>
          {notification.type === 'success' && '✓'}
          {notification.type === 'error' && '✕'}
          {notification.type === 'info' && 'ℹ'}
          {notification.type === 'warning' && '⚠'}
        </strong>
        {notification.message}
        <button
          type="button"
          className="btn-close"
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(notification.id);
          }}
          aria-label="Close"
        ></button>
      </div>
    );
  };

  const renderMuiNotification = (notification: Notification) => {
    const severityMap = {
      success: 'success' as const,
      error: 'error' as const,
      info: 'info' as const,
      warning: 'warning' as const,
    };

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };

    return (
      <Snackbar
        key={notification.id}
        open={true}
        autoHideDuration={5000}
        onClose={() => removeNotification(notification.id)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        <Alert
          onClose={() => removeNotification(notification.id)}
          severity={severityMap[notification.type]}
          sx={{ width: '100%', cursor: 'pointer' }}
          icon={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>{icons[notification.type]}</span>}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
        }}
      >
        {library === 'mui' ? (
          notifications.map((notification) => renderMuiNotification(notification))
        ) : library === 'bootstrap' ? (
          notifications.map((notification) => renderBootstrapNotification(notification))
        ) : (
          <>
            {notifications.map((notification) => renderTailwindNotification(notification))}
            <style>{`
              @keyframes slide-in-right {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              .animate-slide-in-right {
                animation: slide-in-right 0.3s ease-out;
              }
            `}</style>
          </>
        )}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    // Fallback para cuando no hay provider (devuelve alerts)
    return {
      showNotification: (msg: string) => alert(msg),
      showSuccess: (msg: string) => alert(msg),
      showError: (msg: string) => alert(msg),
      showInfo: (msg: string) => alert(msg),
      showWarning: (msg: string) => alert(msg),
    };
  }
  return ctx;
}
