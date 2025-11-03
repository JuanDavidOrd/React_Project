import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, googleProvider, githubProvider, microsoftProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { useNotifications } from '../utils/notifications';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  token: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError, showWarning } = useNotifications();

  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const logout = async () => {
    await signOut(auth);
  };

  const resetInactivityTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (user) {
      timeoutRef.current = setTimeout(async () => {
        await logout();
        showWarning('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
      }, SESSION_TIMEOUT);
    }
  }, [user, showWarning]);

  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    let activityTimer: NodeJS.Timeout | null = null;
    
    const handleActivity = () => {
      if (activityTimer) return;
      
      activityTimer = setTimeout(() => {
        resetInactivityTimeout();
        activityTimer = null;
      }, 1000);
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetInactivityTimeout();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (activityTimer) {
        clearTimeout(activityTimer);
      }
    };
  }, [user, resetInactivityTimeout]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const idToken = await u.getIdToken();
          setToken(idToken);
          localStorage.setItem('authToken', idToken);
        } catch (error) {
          setToken(null);
        }
      } else {
        setToken(null);
        try {
          localStorage.removeItem('authToken');
        } catch {}
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        showWarning('Por favor, permite ventanas emergentes en tu navegador para iniciar sesión.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuario cerró la ventana, no mostrar error
      } else if (error.code === 'auth/network-request-failed') {
        showError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
      } else {
        showError(`No se pudo iniciar sesión con Google. ${error.message || 'Por favor, intenta nuevamente.'}`);
      }
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        showWarning('Por favor, permite ventanas emergentes en tu navegador para iniciar sesión.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuario cerró la ventana, no mostrar error
      } else if (error.code === 'auth/network-request-failed') {
        showError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
      } else {
        showError(`No se pudo iniciar sesión con GitHub. ${error.message || 'Por favor, intenta nuevamente.'}`);
      }
      throw error;
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      await result.user.getIdToken();
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        showWarning('Por favor, permite ventanas emergentes en tu navegador para iniciar sesión con Microsoft.');
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        // Usuario cerró o canceló la ventana, no mostrar error
      } else if (error.code === 'auth/unauthorized-domain') {
        showError('Este dominio no está autorizado en Firebase. Contacta al administrador del sistema para agregar tu dominio.');
      } else if (error.code === 'auth/operation-not-allowed') {
        showError('El proveedor de Microsoft no está habilitado. Contacta al administrador del sistema.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        showWarning('Esta cuenta ya está registrada con otro método de inicio de sesión. Por favor, usa el mismo método que utilizaste anteriormente.');
      } else if (error.code === 'auth/invalid-credential') {
        if (error.message.includes('AADSTS7000215') || error.message.includes('Invalid client secret')) {
          showError('Error de configuración de Microsoft:\n\n' +
                'El Client Secret configurado es incorrecto.\n\n' +
                'Para solucionarlo:\n' +
                '1. Ve a Firebase Console → Authentication → Sign-in method → Microsoft\n' +
                '2. En Azure AD, copia el "Value" (NO el "Secret ID")\n' +
                '3. Pégalo en Firebase como "Application client secret"\n' +
                '4. Guarda los cambios');
        } else {
          showError('Credenciales inválidas. Por favor, verifica tus datos e intenta nuevamente.');
        }
      } else if (error.code === 'auth/network-request-failed') {
        showError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
      } else {
        showError(`No se pudo iniciar sesión con Microsoft. ${error.message || 'Por favor, intenta nuevamente.'}`);
      }
      throw error;
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    token,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft,
    logout,
  }), [user, loading, token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}


