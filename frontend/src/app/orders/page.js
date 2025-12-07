// src/app/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';
import { Package, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.list({ page: 1, limit: 50 });
      setOrders(data.orders);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const loadOrderDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      const { data } = await ordersAPI.getById(orderId);
      setExpandedOrder(orderId);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, details: data.order } : order
      ));
    } catch (error) {
      toast.error('Erro ao carregar detalhes');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-64"></div>
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nenhum pedido realizado
        </h2>
        <p className="text-gray-600 mb-8">
          Seus pedidos aparecerão aqui após a compra
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Meus <span className="gradient-text">Pedidos</span>
        </h1>
        <p className="text-gray-600">
          Histórico de {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => loadOrderDetails(order.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-green rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pedido #{order.id.slice(0, 8)}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.created_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>R$ {parseFloat(order.total).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="badge badge-green">
                  {order.status || 'Concluído'}
                </span>
                {expandedOrder === order.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedOrder === order.id && order.details && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">
                  Itens do Pedido
                </h4>
                
                <div className="space-y-3">
                  {order.details.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantidade: {item.quantity} × R$ {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">
                          R$ {parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}