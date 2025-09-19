"use client";

import { Customer, ShippingAddress, OrderSummary } from '@/types/order';
import { CartItem } from '@/types/product';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

interface OrderReviewProps {
  customer: Customer;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
  orderSummary: OrderSummary;
  onEdit: (section: string) => void;
}

const OrderReview = ({ customer, shippingAddress, cartItems, orderSummary, onEdit }: OrderReviewProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Informazioni Personali</h3>
          <button
            onClick={() => onEdit('customer')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Modifica
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nome</p>
            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Telefono</p>
            <p className="font-medium">{customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Indirizzo di Spedizione</h3>
          <button
            onClick={() => onEdit('shipping')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Modifica
          </button>
        </div>
        <div>
          <p className="font-medium">{shippingAddress.address}</p>
          <p className="text-gray-600">
            {shippingAddress.postalCode} {shippingAddress.city}
          </p>
          <p className="text-gray-600">{shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Prodotti Ordinati</h3>
          <button
            onClick={() => onEdit('cart')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Modifica
          </button>
        </div>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
              <img
                src={getImageUrl(item.product.mainImage)}
                alt={getTextValue(item.product.title)}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-black">
                  {getTextValue(item.product.title)}
                </h4>
                <p className="text-sm text-gray-600">
                  Quantità: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Method */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Metodo di Spedizione</h3>
          <button
            onClick={() => onEdit('shipping')}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Modifica
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{orderSummary.shippingMethod.name}</p>
            <p className="text-sm text-gray-600">
              {orderSummary.shippingMethod.estimatedDays}
            </p>
          </div>
          <p className="font-medium">
            {formatPrice(orderSummary.shippingMethod.cost)}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-black mb-4">Riepilogo Ordine</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotale:</span>
            <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Spese di spedizione:</span>
            <span className="font-medium">{formatPrice(orderSummary.shippingCost)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-black">Totale:</span>
              <span className="text-lg font-bold text-primary">{formatPrice(orderSummary.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
