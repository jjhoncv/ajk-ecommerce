import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";

export default async function AccountPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession();

  // Si no hay sesión, redirigir al inicio
  // Esto es una doble verificación, ya que el middleware debería manejar esto
  if (!session) {
    redirect("/");
  }

  // Obtener datos para el header y footer
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header megaMenuCategories={data.megaMenuCategories} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {session.user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {session.user?.name || "Usuario"}
              </h2>
              <p className="text-gray-600">{session.user?.email || ""}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">
                Información Personal
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Nombre:</span>{" "}
                {session.user?.name || "No disponible"}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span>{" "}
                {session.user?.email || "No disponible"}
              </p>
              <button className="mt-3 text-primary hover:text-primary/80">
                Editar información
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Seguridad</h3>
              <p className="text-gray-600 mb-4">
                Gestiona tu contraseña y la seguridad de tu cuenta.
              </p>
              <button className="text-primary hover:text-primary/80">
                Cambiar contraseña
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Pedidos Recientes</h3>
              <p className="text-gray-600 mb-4">No tienes pedidos recientes.</p>
              <button className="text-primary hover:text-primary/80">
                Ver todos los pedidos
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Direcciones</h3>
              <p className="text-gray-600 mb-4">
                Gestiona tus direcciones de envío y facturación.
              </p>
              <button className="text-primary hover:text-primary/80">
                Administrar direcciones
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer sections={data.footerSections} socialLinks={data.socialLinks} />
    </div>
  );
}
