"use client";
import React from "react";
import { CartProvider } from "./CartProvider";
import { ThemeProvider } from "./ThemeProvider";
import MiniCart from "@/components/ui/MiniCart";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <MiniCart />
      </CartProvider>
    </ThemeProvider>
  );
}
