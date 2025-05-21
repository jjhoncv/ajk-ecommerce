"use client";
import React, { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface SlidePageProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  direction?: "left" | "right";
  width?: number;
}

const SlidePage: React.FC<SlidePageProps> = ({
  isOpen,
  onClose,
  children,
  title,
  direction = "right",
  width = 400,
}) => {
  const slideRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        slideRef.current &&
        !slideRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Manejar tecla Escape para cerrar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const transformValue =
    direction === "right"
      ? isOpen
        ? "translateX(0)"
        : "translateX(100%)"
      : isOpen
      ? "translateX(0)"
      : "translateX(-100%)";

  const positionStyle = direction === "right" ? { right: 0 } : { left: 0 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity">
      <div
        ref={slideRef}
        className="fixed top-0 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-auto"
        style={{
          ...positionStyle,
          width: `${width}px`,
          transform: transformValue,
        }}
      >
        {title && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export default SlidePage;
