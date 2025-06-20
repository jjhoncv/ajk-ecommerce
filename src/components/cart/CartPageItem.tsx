import { PlusMinusButton } from "@/components/ui/PlusMinusButton";
import { formatPrice } from "@/helpers/utils";
import { CartItem } from "@/hooks/useCart";
import { useCartContext } from "@/providers/cart";
import { AlertTriangle, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

// Helper para obtener precio con promoción
const getPriceIfHasPromotion = (item: CartItem) => {
  const currentPromotion = item.promotionVariants?.[0];
  const originalPrice = Number(item.price);
  const promotionPrice = currentPromotion ? Number(currentPromotion.promotionPrice) : null;
  const finalPrice = promotionPrice || originalPrice;

  return {
    finalPrice,
    hasPromotion: Boolean(currentPromotion),
    originalPrice,
    currentPromotion
  };
};

interface CartPageItemProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelection: () => void;
  // 🆕 Información de stock actualizada desde validación
  stockInfo?: {
    id: number;
    availableStock: number;
  };
}

export const CartPageItem: FC<CartPageItemProps> = ({
  item,
  isSelected,
  onToggleSelection,
  stockInfo // 🆕 Recibir stockInfo desde el padre
}) => {
  const { updateQuantity, openDeleteConfirmation } = useCartContext();
  const { finalPrice, hasPromotion, originalPrice } = getPriceIfHasPromotion(item);

  // ✅ Determinar el stock actual
  // Si stockInfo está disponible, usarlo; si no, usar el stock del item
  const currentStock = stockInfo?.availableStock ?? item.stock;
  const hasStockIssue = item.quantity > currentStock;
  const isOutOfStock = currentStock === 0;

  // ✅ SIEMPRE usar el stock real para controles (no el stock original)
  const stockForControls = currentStock;
  const maxAvailable = Math.max(0, stockForControls);

  const handleQuantityChange = (newQuantity: number) => {
    console.log(`🔄 Quantity change requested for item ${item.id} (${item.name}):`);
    console.log(`   Current quantity: ${item.quantity}`);
    console.log(`   New quantity: ${newQuantity}`);
    console.log(`   Current item stock: ${item.stock}`);
    console.log(`   Current stockInfo: ${stockInfo?.availableStock ?? 'none'}`);

    // ✅ SIEMPRE actualizar la cantidad, independientemente del stock
    // La validación de stock es solo para mostrar advertencias, no para bloquear cambios
    if (newQuantity >= 0) {
      console.log(`✅ Calling updateQuantity(${item.id}, ${newQuantity})`);

      // 🔍 Verificar localStorage antes del update
      const cartBefore = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemBefore = cartBefore.find((cartItem: any) => cartItem.id === item.id);
      console.log(`📋 Item in localStorage BEFORE update:`, itemBefore);

      updateQuantity(item.id, newQuantity);

      // 🔍 Verificar localStorage después del update (con delay)
      setTimeout(() => {
        const cartAfter = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemAfter = cartAfter.find((cartItem: any) => cartItem.id === item.id);
        console.log(`📋 Item in localStorage AFTER update:`, itemAfter);
      }, 50);

    } else {
      console.log(`❌ Invalid quantity: ${newQuantity} (must be >= 0)`);
    }
  };

  const handleRemove = () => {
    openDeleteConfirmation(item.id, item.name);
  };

  // ✅ Función para ajuste rápido a stock máximo
  const handleQuickAdjust = () => {
    if (currentStock > 0) {
      updateQuantity(item.id, currentStock);
    }
  };

  return (
    <div className={`bg-white border p-4 hover:shadow-sm transition-all relative ${hasStockIssue ? 'border-red-200 bg-red-50' : ''
      }`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={isSelected}
            onChange={onToggleSelection}
          />
        </div>

        {/* Imagen del producto */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20 bg-gray-100 overflow-hidden">
            <Link href={`/productos/variante/${item.id}`}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Información del producto */}
        <div className="flex-1 min-w-0">
          <div>
            <div className="flex-1 flex flex-col pr-4 gap-2">
              <div className="flex w-full justify-between">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  <Link
                    href={`/productos/variante/${item.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center">
                      {/* Badge de promoción */}
                      {hasPromotion && (
                        <div className="bg-red-500 text-white text-[11px] px-1 h-4 leading-4 mr-1 font-semibold z-10">
                          Promo
                        </div>
                      )}
                      <span>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={handleRemove}
                    className="flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>


              <div className="flex w-full justify-between">
                {hasPromotion ? (
                  <div className="flex gap-1 items-end">
                    {/* Precio con promoción */}
                    <div className="text-lg leading-5 font-semibold text-red-500">
                      {formatPrice(finalPrice)}
                    </div>
                    {/* Precio original tachado */}
                    <div className="text-sm leading-[14px] text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </div>
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(finalPrice)}
                  </div>
                )}

                {/* Precio y controles */}
                <div className="flex flex-col items-end gap-3">
                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <PlusMinusButton
                      stock={stockForControls} // ✅ Usar stock contextual
                      initialQuantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemoveRequest={handleRemove}
                      size="sm"
                      allowRemove={true}
                      // 🆕 Preservar cantidad del usuario cuando hay validación de stock
                      preserveQuantity={Boolean(stockInfo)}
                    />
                  </div>
                </div>
              </div>
              {/* ✅ Advertencia de stock (solo se muestra cuando hay problemas Y stockInfo) */}
              {stockInfo && hasStockIssue && (
                <div className={`mt-2 p-2 rounded ${isOutOfStock ? 'bg-red-100 border border-red-200' : 'bg-orange-100 border border-orange-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    {isOutOfStock ? (
                      <Package className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    )}
                    <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-700' : 'text-orange-700'
                      }`}>
                      {isOutOfStock ? 'Sin stock disponible' : 'Stock limitado'}
                    </span>
                  </div>

                  <p className={`text-xs mt-1 ${isOutOfStock ? 'text-red-600' : 'text-orange-600'
                    }`}>
                    {isOutOfStock ? (
                      'Este producto ya no está disponible'
                    ) : (
                      `Tienes ${item.quantity} seleccionados, pero solo hay ${currentStock} disponible${currentStock !== 1 ? 's' : ''}`
                    )}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};