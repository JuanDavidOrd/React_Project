import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UiLibrary = 'tailwind' | 'mui' | 'bootstrap';

type UiLibraryContextValue = {
  library: UiLibrary;
  setLibrary: (l: UiLibrary) => void;
};

const UiLibraryContext = createContext<UiLibraryContextValue | undefined>(undefined);

export const UiLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<UiLibrary>('tailwind');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('uiLibrary') as UiLibrary | null;
      if (stored) setLibrary(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('uiLibrary', library);
    } catch {}
    if (library === 'bootstrap') {
      const id = 'bootstrap-css';
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
      }
    }
  }, [library]);

  const value = useMemo(() => ({ library, setLibrary }), [library]);
  return <UiLibraryContext.Provider value={value}>{children}</UiLibraryContext.Provider>;
};

export function useUiLibrary() {
  const ctx = useContext(UiLibraryContext);
  if (!ctx) throw new Error('useUiLibrary debe usarse dentro de UiLibraryProvider');
  return ctx;
}


