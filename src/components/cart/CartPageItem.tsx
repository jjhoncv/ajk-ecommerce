import { PlusMinusButton } from "@/components/ui/PlusMinusButton";
import { formatPrice } from "@/helpers/utils";
import { CartItem } from "@/hooks/useCart";
import { useCartContext } from "@/providers/cart";
import { Trash2 } from "lucide-react";
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
}

export const CartPageItem: FC<CartPageItemProps> = ({
  item,
  isSelected,
  onToggleSelection
}) => {
  const { updateQuantity, openDeleteConfirmation } = useCartContext();
  const { finalPrice, hasPromotion, originalPrice } = getPriceIfHasPromotion(item);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    openDeleteConfirmation(item.id, item.name);
  };

  return (
    <div className={`bg-white border p-4 hover:shadow-sm transition-all relative`}>
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


              {/* Información simplificada de promoción o cupones */}
              {/* {hasPromotion && (
                <div className="flex items-center gap-1 mb-3">
                  <Tag className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">Promo</span>
                </div>
              )} */}

              {/* Acciones */}

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
                  <div className="flex items-center">
                    <PlusMinusButton
                      stock={item.stock}
                      initialQuantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemoveRequest={handleRemove}
                      size="sm"
                      allowRemove={true}
                    />
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>
      </div>
    </div>
  );
};