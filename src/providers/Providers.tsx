"use client";
import React from "react";
import { CartProvider } from "./CartProvider";
import { ThemeProvider } from "./ThemeProvider";
import MiniCart from "@/components/ui/MiniCart";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <CartProvider>
          {children}
          <MiniCart />
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
