import categoryModel from "@/backend/category";
import Header from "@/components/layout/Header";
import Layout from "@/components/layout/Layout";
import Navigation from "@/components/ui/Navigation";
import { AlertCircle, CheckCircle, Clock, Package } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Datos de ejemplo para pedidos
const mockOrders = [
  {
    id: "ORD-12345",
    date: "15 Mayo, 2025",
    total: 1250.0,
    status: "Entregado",
    items: 3,
  },
  {
    id: "ORD-12346",
    date: "10 Mayo, 2025",
    total: 850.5,
    status: "En camino",
    items: 2,
  },
  {
    id: "ORD-12347",
    date: "5 Mayo, 2025",
    total: 1500.0,
    status: "Procesando",
    items: 4,
  },
  {
    id: "ORD-12348",
    date: "1 Mayo, 2025",
    total: 350.0,
    status: "Cancelado",
    items: 1,
  },
];

// Función para obtener el icono según el estado del pedido
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Entregado":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "En camino":
      return <Package className="h-5 w-5 text-blue-500" />;
    case "Procesando":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "Cancelado":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

export default async function OrdersPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession();

  // Si no hay sesión, redirigir al inicio
  // Esto es una doble verificación, ya que el middleware debería manejar esto
  if (!session) {
    redirect("/");
  }

  // Obtener datos para el header y footer
  const categories = await categoryModel.getCategories()

  return (
    <Layout>
      <Header navigationType="mini" >
        <Navigation type="mini" categories={categories || []} />
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {mockOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items}{" "}
                        {order.items === 1 ? "producto" : "productos"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        S/ {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-2 text-sm text-gray-700">
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary hover:text-primary/80">
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes pedidos
              </h3>
              <p className="text-gray-500 mb-4">
                Cuando realices compras, tus pedidos aparecerán aquí.
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Explorar productos
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
