// components/cart/CartPageContent.tsx
"use client";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPageContent() {
  // 👈 Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    items,
    totalItems,
    totalPrice,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // 👈 Solo hidrata en el cliente
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 👈 Mostrar loading hasta que se hidrate
  if (!isHydrated) {
    return (
      <div className="max-w-screen-4xl mx-auto px-12 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-24"></div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-lg h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-screen-4xl mx-auto px-12 py-16">
        <div className="text-center">
          <div className="mx-auto mb-8 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Parece que aún no has agregado ningún producto a tu carrito.
            ¡Explora nuestros productos y encuentra algo que te guste!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-4xl mx-auto px-12 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continuar comprando
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
          <div className="text-sm text-gray-600">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header de la tabla */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
            <div className="col-span-6">Producto</div>
            <div className="col-span-2 text-center">Precio</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {/* Productos */}
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Imagen y detalles del producto */}
                <div className="md:col-span-6">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Stock disponible: {item.stock}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm mt-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Precio unitario */}
                <div className="md:col-span-2 text-center">
                  <div className="font-medium text-gray-900">
                    S/ {item.price.toFixed(2)}
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total del producto */}
                <div className="md:col-span-2 text-center">
                  <div className="font-semibold text-gray-900">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Botón para vaciar carrito */}
          <div className="pt-4 border-t">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumen del pedido
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} productos)</span>
                <span>S/ {totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Proceder al pago
              </button>

              <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Guardar para después
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Envío gratis en pedidos sobre S/ 99</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Entrega en 24-48 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Devolución gratuita en 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos recomendados */}
      <div className="mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          También te puede interesar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Aquí irían productos recomendados - placeholder por ahora */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}