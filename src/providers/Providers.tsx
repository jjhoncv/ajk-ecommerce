"use client";
import MiniCart from "@/components/ui/MiniCart";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { CartProvider } from "./CartProvider";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <CartProvider>
          <main>
            {children}
            <MiniCart />
          </main>
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
