import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'max-w-md',
  zIndex = 'z-50',
  hideHeader = false,
  className = '',
}) => {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity ${zIndex}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-md w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh] animate-slide-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div>
              {subtitle && (
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">
                  {subtitle}
                </span>
              )}
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 leading-tight">
                {icon && <span className="text-indigo-500">{icon}</span>}
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition flex-shrink-0 ml-4"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
