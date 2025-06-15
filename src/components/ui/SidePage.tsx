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
  // Manejar el margin del contenido principal
  useEffect(() => {
    const contentPage = document.getElementById("content-page");
    if (!contentPage) return;

    if (isOpen) {
      const marginProperty = direction === "right" ? "marginRight" : "marginLeft";
      contentPage.style[marginProperty] = `${width}px`;
    } else {
      // Remover márgenes cuando se cierra
      contentPage.style.marginLeft = "0";
      contentPage.style.marginRight = "0";
    }

    // Cleanup function
    return () => {
      if (contentPage) {
        contentPage.style.marginLeft = "";
        contentPage.style.marginRight = "";
      }
    };
  }, [isOpen, width, direction]);

  const positionClass = direction === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`fixed z-50 top-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-auto ${positionClass} ${isOpen ? "translate-x-0" : direction === "right" ? "translate-x-full" : "-translate-x-full"
        }`}
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  );
};

export default SidePage;