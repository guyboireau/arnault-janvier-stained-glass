'use client';

import { useState, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                          p-4 rounded-md shadow-lg transform transition-all duration-300 ease-in-out
                          ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : ''}
                          ${toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : ''}
                          ${toast.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : ''}
                        `}
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-4 text-sm font-medium opacity-70 hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
