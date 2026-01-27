import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className={cn(
                "relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all",
                className
            )}>
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-lg font-medium leading-6 text-neutral-900">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <span className="sr-only">Fermer</span>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
