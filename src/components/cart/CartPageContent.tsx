"use client";
import { CartPageEmpty } from "@/components/cart/CartPageEmpty";
import { CartPageItem } from "@/components/cart/CartPageItem";
import { CartPageSummary } from "@/components/cart/CartPageSummary";
import { CartPageSkeleton } from "@/components/cart/Skeleton/CartPageSkeleton";
import { useSummaryCart } from "@/hooks/useSummaryCart";
import { useCartContext } from "@/providers/cart";

export default function CartPageContent() {
  const { items, totalItems, isInitialized } = useCartContext();

  // 🆕 Hook dedicado para el manejo de la selección del resumen
  const summaryCart = useSummaryCart(items);

  // Mostrar shimmer mientras carga
  if (!isInitialized) {
    return <CartPageSkeleton />;
  }

  // Mostrar página vacía si no hay items
  if (items.length === 0) {
    return <CartPageEmpty />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Cesta ({totalItems})
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lista de productos */}
        <div className="xl:col-span-8">
          {/* Header con opciones de selección */}
          <div className="bg-white border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={summaryCart.isAllSelected}
                  onChange={summaryCart.toggleSelectAll}
                />
                <span className="text-sm font-medium text-gray-900">
                  Seleccionar todos los artículos
                </span>
              </label>
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                onClick={() => {
                  // Eliminar todos los items seleccionados del carrito principal
                  summaryCart.selectedItems.forEach(item => {
                    // Usar la función del carrito principal para eliminar
                  });
                }}
                disabled={summaryCart.getSelectedCount() === 0}
              >
                Borrar artículos seleccionados ({summaryCart.getSelectedCount()})
              </button>
            </div>
          </div>

          {/* Promoción */}
          {/* <CartPageActivePromotions selectedItems={summaryCart.selectedItems} /> */}


          {/* Productos */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartPageItem
                key={item.id}
                item={item}
                isSelected={summaryCart.isItemSelected(item.id)}
                onToggleSelection={() => summaryCart.toggleItemSelection(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="xl:col-span-4">
          <CartPageSummary summaryCart={summaryCart} />
        </div>
      </div>
    </div>
  );
}