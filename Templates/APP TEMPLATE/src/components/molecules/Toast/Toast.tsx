// services/main/src/context/ToastContext.tsx

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from '@/components/molecules/Toast/Toast.module.css';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const AUTO_CLOSE_DURATION = 3000;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    message: string, 
    variant: ToastVariant = 'info', 
    duration: number = AUTO_CLOSE_DURATION
  ) => {
    const id = Date.now();
    const newToast = { id, message, variant };

    // Add new toast to the beginning and limit total count to 5
    setToasts((prevToasts) => [newToast, ...prevToasts].slice(0, 5)); 

    // Set timeout to remove the toast, triggering the exit animation
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);
    
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Display Container (Fixed Position) */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`${styles.toast} ${styles[toast.variant]} ${styles.visible}`} 
            role="alert"
          >
            {toast.message}
          </div>
        ))}
      </div>
      
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    // This provides a clear error if the hook is used outside the provider
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};