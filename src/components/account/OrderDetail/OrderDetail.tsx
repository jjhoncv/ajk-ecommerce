"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  X
} from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  productName: string;
  variantSku: string;
  variantAttributes: any;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount: number;
}

interface TrackingEvent {
  id: number;
  status: string;
  currentLocation?: string;
  courierCompany?: string;
  trackingNumber?: string;
  deliveryNotes?: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  deliveredTo?: string;
}

interface ShippingAddress {
  alias: string;
  streetName: string;
  streetNumber: string;
  apartment?: string;
  district: string;
  province: string;
  department: string;
}

interface OrderDetailData {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
  estimatedDelivery?: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  shippingMethod?: string;
  shippingAddress?: ShippingAddress;
  customerNotes?: string;
  adminNotes?: string;
  items: OrderItem[];
  itemCount: number;
  trackingHistory: TrackingEvent[];
  latestTracking?: {
    status: string;
    currentLocation?: string;
    courierCompany?: string;
    trackingNumber?: string;
    deliveryNotes?: string;
    updatedAt: string;
  };
  canCancel: boolean;
  hasTracking: boolean;
  isDelivered: boolean;
  needsPayment: boolean;
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: { label: "Pendiente", color: "text-yellow-700", bgColor: "bg-yellow-100", icon: Clock },
  processing: { label: "Procesando", color: "text-blue-700", bgColor: "bg-blue-100", icon: Package },
  shipped: { label: "Enviado", color: "text-purple-700", bgColor: "bg-purple-100", icon: Truck },
  delivered: { label: "Entregado", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "text-red-700", bgColor: "bg-red-100", icon: X }
};

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-orange-600" },
  paid: { label: "Pagado", color: "text-green-600" },
  failed: { label: "Falló", color: "text-red-600" },
  refunded: { label: "Reembolsado", color: "text-blue-600" }
};

export default function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/customer/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Orden no encontrada');
        } else if (response.status === 403) {
          setError('No tienes acceso a esta orden');
        } else {
          setError('Error al cargar la orden');
        }
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError('Error de conexión');
      console.error("Error fetching order detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail();
    } else if (!isOpen) {
      // Reset state when modal closes
      setOrder(null);
      setError(null);
      setShowCancelModal(false);
      setCancelReason("");
    }
  }, [isOpen, orderId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim() || !orderId) return;

    try {
      setCancelling(true);
      const response = await fetch(`/api/customer/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          customerNotes: cancelReason
        })
      });

      if (response.ok) {
        setShowCancelModal(false);
        setCancelReason("");
        fetchOrderDetail(); // Refresh order data
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `S/ ${price.toFixed(2)}`;
  };

  const renderVariantAttributes = (attributes: any) => {
    if (!attributes) return null;

    const attrs = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
    return Object.entries(attrs).map(([key, value]) => (
      <span key={key} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {key}: {value as string}
      </span>
    ));
  };

  const StatusIcon = order ? statusLabels[order.status]?.icon || Package : Package;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <ModalTitle
          onClose={onClose}
          title={order ? `Orden ${order.orderNumber}` : "Cargando orden..."}
        />
        <ModalContent className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-48 bg-gray-200 rounded animate-pulse" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <p className="text-gray-500">
                {error === 'Orden no encontrada'
                  ? 'La orden que buscas no existe.'
                  : 'Inténtalo de nuevo más tarde.'}
              </p>
            </div>
          )}

          {order && !loading && !error && (
            <>
              {/* Header Info */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Realizada el {formatDate(order.createdAt)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusLabels[order.status]?.bgColor} ${statusLabels[order.status]?.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="font-medium">{statusLabels[order.status]?.label}</span>
                    </div>
                    <div className={`text-sm font-medium ${paymentStatusLabels[order.paymentStatus]?.color}`}>
                      {paymentStatusLabels[order.paymentStatus]?.label}
                    </div>
                  </div>
                </div>
                {order.canCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancelar orden
                  </Button>
                )}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Items */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Productos ({order.itemCount})</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">{item.productName}</h4>
                            <p className="text-xs text-gray-500 mb-1">SKU: {item.variantSku}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {renderVariantAttributes(item.variantAttributes)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span>Cant: {item.quantity}</span>
                              <span>Unit: {formatPrice(item.unitPrice)}</span>
                              {item.discountAmount > 0 && (
                                <span className="text-green-600">Desc: -{formatPrice(item.discountAmount)}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{formatPrice(item.totalPrice)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking */}
                  {order.hasTracking && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">Seguimiento del envío</h3>

                      {order.latestTracking && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900 text-sm">Estado actual</span>
                          </div>
                          <p className="text-blue-800 text-sm mb-1">
                            {statusLabels[order.latestTracking.status]?.label || order.latestTracking.status}
                          </p>
                          {order.latestTracking.currentLocation && (
                            <p className="text-xs text-blue-700">
                              📍 {order.latestTracking.currentLocation}
                            </p>
                          )}
                          {order.latestTracking.trackingNumber && (
                            <p className="text-xs text-blue-700">
                              N° seguimiento: {order.latestTracking.trackingNumber}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Historial</h4>
                        <div className="max-h-40 overflow-y-auto">
                          {order.trackingHistory.map((event, index) => (
                            <div key={event.id} className="flex gap-3 pb-3 last:pb-0">
                              <div className="flex flex-col items-center">
                                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                {index < order.trackingHistory.length - 1 && (
                                  <div className="w-px h-6 bg-gray-200 mt-1" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">
                                    {statusLabels[event.status]?.label || event.status}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(event.createdAt)}
                                  </span>
                                </div>
                                {event.currentLocation && (
                                  <p className="text-xs text-gray-600">📍 {event.currentLocation}</p>
                                )}
                                {event.deliveryNotes && (
                                  <p className="text-xs text-gray-600">{event.deliveryNotes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Payment Info */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-sm">Información de pago</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Método</div>
                          <div className="font-medium text-sm">{order.paymentMethod}</div>
                        </div>
                      </div>
                      {order.paidAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Pagado el</div>
                            <div className="font-medium text-sm">{formatDate(order.paidAt)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-sm">Dirección de envío</h3>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-sm">{order.shippingAddress.alias}</div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>{order.shippingAddress.streetName} {order.shippingAddress.streetNumber}
                              {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                            </p>
                            <p>{order.shippingAddress.district}, {order.shippingAddress.province}</p>
                            <p>{order.shippingAddress.department}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-sm">Resumen</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento</span>
                          <span>-{formatPrice(order.discountAmount)}</span>
                        </div>
                      )}
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between">
                          <span>Envío</span>
                          <span>{formatPrice(order.shippingCost)}</span>
                        </div>
                      )}
                      {order.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Impuestos</span>
                          <span>{formatPrice(order.taxAmount)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.estimatedDelivery && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-sm">Entrega</h3>
                      <div className="space-y-2">
                        {order.shippingMethod && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-500">Método</div>
                              <div className="font-medium text-sm">{order.shippingMethod}</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Estimada</div>
                            <div className="font-medium text-sm">{formatDate(order.estimatedDelivery)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {(order.customerNotes || order.adminNotes) && (
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-sm">Notas</h3>
                      <div className="space-y-3">
                        {order.customerNotes && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Tus notas</div>
                            <div className="text-xs bg-gray-50 p-2 rounded">
                              {order.customerNotes}
                            </div>
                          </div>
                        )}
                        {order.adminNotes && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Notas del vendedor</div>
                            <div className="text-xs bg-blue-50 p-2 rounded">
                              {order.adminNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} className="max-w-md">
          <ModalTitle
            onClose={() => setShowCancelModal(false)}
            title="Cancelar orden"
          />
          <ModalContent>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.
              </p>

              <div className="space-y-2">
                <Label htmlFor="cancelReason" className="text-sm">Motivo de cancelación</Label>
                <Input
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Explica por qué deseas cancelar..."
                  className="text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 text-sm"
                >
                  Mantener orden
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={!cancelReason.trim() || cancelling}
                  className="flex-1 text-sm"
                >
                  {cancelling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelando...
                    </div>
                  ) : (
                    "Cancelar orden"
                  )}
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}