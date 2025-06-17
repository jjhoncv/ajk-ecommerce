"use client";
import MiniCart from "@/components/ui/MiniCart";
import { AuthModalProvider } from "@/providers/auth-modal";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CartProvider } from "./cart/CartProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthModalProvider>
          <CartProvider>
            <main>
              {children}
              <MiniCart />
            </main>
          </CartProvider>
        </AuthModalProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
