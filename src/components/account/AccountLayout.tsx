"use client";

import {
  ChevronRight,
  Lock,
  LogOut,
  MapPinHouse,
  Package,
  User
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AccountLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

export default function AccountLayout({ children, userName = "John Doe" }: AccountLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/account/orders",
      label: "Mis compras",
      icon: Package,
      active: pathname.startsWith("/account/orders")
    },
    {
      href: "/account/edit-profile",
      label: "Datos personales",
      icon: User,
      active: pathname === "/account/edit-profile"
    },
    {
      href: "/account/change-password",
      label: "Cambiar contraseña",
      icon: Lock,
      active: pathname === "/account/change-password"
    },
    {
      href: "/account/addresses",
      label: "Direcciones",
      icon: MapPinHouse,
      active: pathname === "/account/addresses"
    }
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Mi cuenta</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-96 bg-white p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Hola, {userName}</h2>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between p-3 transition-colors ${item.active
                      ? "bg-gray-100"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className={item.active ? "font-medium" : ""}>{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}