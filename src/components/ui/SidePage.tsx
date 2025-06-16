"use client";
import React, { ReactNode, useEffect } from "react";

interface SidePageProps {
  isOpen: boolean;
  children: ReactNode;
  direction?: "left" | "right";
  width?: number;
}

const SidePage: React.FC<SidePageProps> = ({
  isOpen,
  children,
  direction = "right",
  width = 400,
}) => {
  // Manejar el margin del body completo
  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      const marginProperty = direction === "right" ? "marginRight" : "marginLeft";
      body.style[marginProperty] = `${width}px`;
      body.style.transition = "margin 300ms ease-in-out";
    } else {
      // Remover márgenes cuando se cierra
      body.style.marginLeft = "0";
      body.style.marginRight = "0";
      body.style.transition = "margin 300ms ease-in-out";
    }

    // Cleanup function
    return () => {
      if (body) {
        body.style.marginLeft = "";
        body.style.marginRight = "";
        body.style.transition = "";
      }
    };
  }, [isOpen, width, direction]);

  const positionClass = direction === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`fixed z-40 top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-auto ${positionClass} ${isOpen
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