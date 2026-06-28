import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const Toast = ({ toast, onRemove }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, toast.duration - 300);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-500" />,
    error: <XCircle size={20} className="text-rose-500" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-rose-50 border-rose-100",
    warning: "bg-amber-50 border-amber-100",
    info: "bg-blue-50 border-blue-100",
  };

  const textStyles = {
    success: "text-emerald-800",
    error: "text-rose-800",
    warning: "text-amber-800",
    info: "text-blue-800",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm min-w-[300px] max-w-sm transition-all duration-300 ${
        bgStyles[toast.type] || bgStyles.info
      } ${
        isClosing
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-slide-in"
      }`}
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold leading-snug ${
            textStyles[toast.type] || textStyles.info
          }`}
        >
          {toast.message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1 rounded-lg"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
