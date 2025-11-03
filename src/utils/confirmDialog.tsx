import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useUiLibrary } from '../context/UiLibraryContext';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const { library } = useUiLibrary();

  const confirm = useCallback((options: ConfirmOptions) => {
    setDialog(options);
  }, []);

  const handleConfirm = () => {
    if (dialog) {
      dialog.onConfirm();
      setDialog(null);
    }
  };

  const handleCancel = () => {
    if (dialog) {
      if (dialog.onCancel) {
        dialog.onCancel();
      }
      setDialog(null);
    }
  };

  const renderTailwindDialog = () => {
    if (!dialog) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-5"
        onClick={handleCancel}
      >
        <div
          className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {dialog.title || 'Confirmar acción'}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {dialog.message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 border-2 border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {dialog.cancelText || 'Cancelar'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              {dialog.confirmText || 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBootstrapDialog = () => {
    if (!dialog) return null;

    return (
      <div
        className="modal fade show"
        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleCancel}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">
                {dialog.title || 'Confirmar acción'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">{dialog.message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                {dialog.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirm}
              >
                {dialog.confirmText || 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMuiDialog = () => {
    if (!dialog) return null;

    return (
      <Dialog
        open={true}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{dialog.title || 'Confirmar acción'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            {dialog.cancelText || 'Cancelar'}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            {dialog.confirmText || 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <>
          {library === 'mui' && renderMuiDialog()}
          {library === 'bootstrap' && renderBootstrapDialog()}
          {library === 'tailwind' && renderTailwindDialog()}
        </>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Fallback a confirm nativo
    return {
      confirm: (options: ConfirmOptions) => {
        if (window.confirm(options.message)) {
          options.onConfirm();
        } else if (options.onCancel) {
          options.onCancel();
        }
      },
    };
  }
  return ctx;
}
