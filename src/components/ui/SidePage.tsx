// SidePage.tsx - Versión mejorada
"use client";
import React, { ReactNode, useEffect, useState } from "react";

interface SidePageProps {
  isOpen: boolean;
  children: ReactNode;
  direction?: "left" | "right";
  width?: number;
  preventInitialAnimation?: boolean; // 👈 NUEVO
}

const SidePage: React.FC<SidePageProps> = ({
  isOpen,
  children,
  direction = "right",
  width = 400,
  preventInitialAnimation = false, // 👈 NUEVO
}) => {
  const [hasInteracted, setHasInteracted] = useState(!preventInitialAnimation)

  useEffect(() => {
    const body = document.body;

    // 👈 Solo aplicar transición si ya hubo interacción del usuario
    const shouldAnimate = hasInteracted || !preventInitialAnimation

    if (isOpen) {
      const marginProperty = direction === "right" ? "marginRight" : "marginLeft";
      body.style[marginProperty] = `${width}px`;

      // 👈 Transición más rápida y sutil
      if (shouldAnimate) {
        body.style.transition = "margin 150ms ease-out"; // Más rápido
      } else {
        body.style.transition = "none"; // Sin transición en primera carga
        // Marcar que ya hubo primera interacción
        setTimeout(() => setHasInteracted(true), 100)
      }
    } else {
      body.style.marginLeft = "0";
      body.style.marginRight = "0";

      if (shouldAnimate) {
        body.style.transition = "margin 150ms ease-out";
      }

      // Marcar interacción al cerrar
      if (!hasInteracted) {
        setHasInteracted(true)
      }
    }

    return () => {
      if (body) {
        body.style.marginLeft = "";
        body.style.marginRight = "";
        body.style.transition = "";
      }
    };
  }, [isOpen, width, direction, hasInteracted, preventInitialAnimation]);

  const positionClass = direction === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`fixed z-40 top-0 h-full bg-white shadow-xl transition-transform duration-150 ease-out overflow-auto ${positionClass} ${isOpen
          ? "translate-x-0"
          : direction === "right"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  );
};

export default SidePage;