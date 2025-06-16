"use client";
import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el toast con una pequeña animación
    setIsVisible(true);

    // Ocultar el toast después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2700); // Un poco menos que el tiempo en useCart para que la animación termine antes

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
