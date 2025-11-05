import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail,
  User,
} from "firebase/auth";
import { auth, googleProvider, githubProvider, microsoftProvider } from "./firebase";
import { useNotifications } from "../utils/notifications";

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

  // ----- Inactividad (30 min) -----
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const resetInactivityTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (user) {
      timeoutRef.current = setTimeout(async () => {
        await logout();
        showWarning(
          "Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente."
        );
      }, SESSION_TIMEOUT);
    }
  }, [user, logout, showWarning]);

  useEffect(() => {
    if (!user) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
    let activityTimer: ReturnType<typeof setTimeout> | null = null;

    const handleActivity = () => {
      if (activityTimer) return;
      activityTimer = setTimeout(() => {
        resetInactivityTimeout();
        activityTimer = null;
      }, 1000);
    };

    events.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    resetInactivityTimeout();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (activityTimer) clearTimeout(activityTimer);
    };
  }, [user, resetInactivityTimeout]);

  // ----- Mantener token fresco -----
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const idToken = await u.getIdToken(); // token actualizado
          setToken(idToken);
          localStorage.setItem("authToken", idToken);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
        try {
          localStorage.removeItem("authToken");
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

  // ----- Helpers de errores comunes -----
  const handlePopupErrors = (providerName: string, error: any) => {
    if (error?.code === "auth/popup-blocked") {
      showWarning(
        "Por favor, permite ventanas emergentes en tu navegador para iniciar sesión."
      );
    } else if (
      error?.code === "auth/popup-closed-by-user" ||
      error?.code === "auth/cancelled-popup-request"
    ) {
      // Usuario cerró o canceló: sin toast de error.
    } else if (error?.code === "auth/network-request-failed") {
      showError(
        "Error de conexión. Verifica tu internet e intenta nuevamente."
      );
    } else if (error?.code === "auth/unauthorized-domain") {
      showError(
        "Este dominio no está autorizado en Firebase. Agrega tu dominio en Authentication → Settings → Authorized domains."
      );
    } else if (error?.code === "auth/operation-not-allowed") {
      showError(
        `El proveedor de ${providerName} no está habilitado en Firebase.`
      );
    } else if (error?.code === "auth/invalid-credential") {
      showError(
        "Credenciales inválidas. Revisa la configuración del proveedor e intenta nuevamente."
      );
    } else {
      showError(`No se pudo iniciar sesión con ${providerName}. ${error?.message || ""}`);
    }
  };

  // Manejo básico de "account-exists-with-different-credential"
  const tryHandleAccountExists = async (error: any) => {
    if (error?.code !== "auth/account-exists-with-different-credential") return false;

    const email: string | undefined = error?.customData?.email;
    if (!email) return false;

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      // Caso típico: el usuario ya registró esa cuenta con Google
      if (methods.includes("google.com")) {
        await signInWithPopup(auth, googleProvider);
        // Opcional: aquí podrías vincular el provider pendiente con linkWithPopup
        // pero requiere re-obtener la credencial original.
        showWarning(
          "Tu correo ya estaba registrado con Google. Iniciaste sesión con ese método."
        );
        return true;
      }
      if (methods.includes("github.com")) {
        await signInWithPopup(auth, githubProvider);
        showWarning(
          "Tu correo ya estaba registrado con GitHub. Iniciaste sesión con ese método."
        );
        return true;
      }
      // Si era password, aquí deberías pedir contraseña y hacer signInWithEmailAndPassword.
      showWarning(
        "Esa cuenta ya existe con otro método de acceso. Inicia con el método que usaste antes."
      );
      return true;
    } catch {
      return false;
    }
  };

  // ----- Logins -----
  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      const handled = await tryHandleAccountExists(error);
      if (!handled) handlePopupErrors("Google", error);
      throw error;
    }
  }, []);

  const loginWithGithub = useCallback(async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      const handled = await tryHandleAccountExists(error);
      if (!handled) handlePopupErrors("GitHub", error);
      throw error;
    }
  }, []);

  const loginWithMicrosoft = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      await result.user.getIdToken(); // fuerza actualización si aplica
    } catch (error: any) {
      // Mensaje específico de client secret inválido (Azure)
      if (
        error?.code === "auth/invalid-credential" &&
        (String(error?.message || "").includes("AADSTS7000215") ||
          String(error?.message || "").includes("Invalid client secret"))
      ) {
        showError(
          [
            "Error de configuración de Microsoft:",
            "El Client Secret configurado es incorrecto.",
            "Solución:",
            "1) Firebase Console → Authentication → Microsoft",
            '2) En Azure AD copia el "Value" del secreto (NO el "Secret ID")',
            "3) Pégalo en Firebase como Application client secret",
            "4) Guarda los cambios",
          ].join("\n")
        );
        throw error;
      }
      const handled = await tryHandleAccountExists(error);
      if (!handled) handlePopupErrors("Microsoft", error);
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      loginWithGoogle,
      loginWithGithub,
      loginWithMicrosoft,
      logout,
    }),
    [user, loading, token, loginWithGoogle, loginWithGithub, loginWithMicrosoft, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
