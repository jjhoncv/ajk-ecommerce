import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";

// Datos de ejemplo para direcciones
const mockAddresses = [
  {
    id: "addr-1",
    name: "Casa",
    recipient: "Juan Pérez",
    street: "Av. Javier Prado 1234",
    district: "San Isidro",
    city: "Lima",
    postalCode: "15046",
    phone: "987654321",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Trabajo",
    recipient: "Juan Pérez",
    street: "Calle Las Begonias 456",
    district: "San Isidro",
    city: "Lima",
    postalCode: "15046",
    phone: "987654322",
    isDefault: false,
  },
  {
    id: "addr-3",
    name: "Departamento",
    recipient: "Juan Pérez",
    street: "Av. Arequipa 789",
    district: "Miraflores",
    city: "Lima",
    postalCode: "15048",
    phone: "987654323",
    isDefault: false,
  },
];

export default async function AddressesPage() {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Direcciones</h1>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Plus className="h-4 w-4 mr-2" />
            Agregar dirección
          </button>
        </div>

        {mockAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAddresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  address.isDefault ? "border-primary" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-gray-900">
                      {address.name}
                    </h3>
                  </div>
                  {address.isDefault && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Predeterminada
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p className="font-medium">{address.recipient}</p>
                  <p>{address.street}</p>
                  <p>
                    {address.district}, {address.city}
                  </p>
                  <p>CP: {address.postalCode}</p>
                  <p>Tel: {address.phone}</p>
                </div>

                <div className="flex space-x-3">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                  {!address.isDefault && (
                    <button className="inline-flex items-center px-3 py-1.5 border border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-primary/5">
                      Predeterminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes direcciones guardadas
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega direcciones para facilitar tus compras.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Plus className="h-4 w-4 mr-2" />
              Agregar dirección
            </button>
          </div>
        )}
      </main>

      <Footer sections={data.footerSections} socialLinks={data.socialLinks} />
    </div>
  );
}
