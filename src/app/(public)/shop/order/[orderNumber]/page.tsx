import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { notFound } from 'next/navigation';

const orderQuery = groq`
  *[_type == "order" && orderNumber == $orderNumber][0] {
    _id,
    orderNumber,
    status,
    customer,
    shippingAddress,
    items,
    subtotal,
    shippingCost,
    total,
    shippingMethod,
    paymentMethod,
    paymentStatus,
    notes,
    createdAt,
    updatedAt
  }
`;

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'In Attesa',
    confirmed: 'Confermato',
    processing: 'In Elaborazione',
    shipped: 'Spedito',
    delivered: 'Consegnato',
    cancelled: 'Annullato'
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface OrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const { orderNumber } = await params;
  const order = await client.fetch(orderQuery, { orderNumber });

  if (!order) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb Section - Gradiente da grigio scuro a bianco */}
      <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName={`Ordine #${order.orderNumber}`}
          description="Dettagli del tuo ordine"
        />
      </div>

      {/* Order Content - Gradiente da bianco ad arancione intenso */}
      <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Order Header */}
              <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-black">
                      Ordine #{order.orderNumber}
                    </h1>
                    <p className="text-gray-600">
                      Effettuato il {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <Link
                      href="/shop"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Continua lo Shopping
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-black mb-4">
                      Informazioni Cliente
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nome</p>
                        <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Telefono</p>
                        <p className="font-medium">{order.customer.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-black mb-4">
                      Indirizzo di Spedizione
                    </h2>
                    <div>
                      <p className="font-medium">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-black mb-4">
                      Prodotti Ordinati
                    </h2>
                    <div className="space-y-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-black">
                              {item.productTitle}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantità: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.total)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.price)} cad.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                      <h2 className="text-xl font-bold text-black mb-4">
                        Note
                      </h2>
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-black mb-6">
                      Riepilogo Ordine
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spese di spedizione:</span>
                        <span className={`font-medium ${order.shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}
                        </span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-black">Totale:</span>
                          <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Metodo di spedizione</p>
                        <p className="font-medium">{order.shippingMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Metodo di pagamento</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stato pagamento</p>
                        <p className="font-medium">{order.paymentStatus}</p>
                      </div>
                    </div>

                    {/* Contact Support */}
                    <div className="mt-6 p-4 bg-white/30rounded-lg">
                      <h3 className="font-semibold text-black mb-2">
                        Hai domande?
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Se hai bisogno di assistenza, contattaci.
                      </p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Contattaci
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OrderPage;
