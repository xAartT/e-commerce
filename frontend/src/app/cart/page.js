'use client';

import { useState, useEffect } from 'react';
import { cartAPI, ordersAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch (error) {
      toast.error('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.update(productId, newQuantity);
      fetchCart();
      toast.success('Quantidade atualizada');
    } catch (error) {
      toast.error('Erro ao atualizar quantidade');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.remove(productId);
      fetchCart();
      toast.success('Item removido');
    } catch (error) {
      toast.error('Erro ao remover item');
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    setProcessing(true);
    try {
      await ordersAPI.create();
      toast.success('Pedido realizado com sucesso!');
      router.push('/orders');
    } catch (error) {
      toast.error('Erro ao finalizar pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-64"></div>
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600 mb-8">
          Adicione produtos ao carrinho para continuar
        </p>
        <button
          onClick={() => router.push('/products')}
          className="btn btn-primary"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Meu <span className="gradient-text">Carrinho</span>
        </h1>
        <p className="text-gray-600">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'} no carrinho
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product_id} className="card flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingCart className="w-10 h-10 text-gray-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  R$ {parseFloat(item.price).toFixed(2)} por unidade
                </p>
                <p className="text-lg font-bold text-primary-600 mt-2">
                  R$ {parseFloat(item.subtotal).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product_id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Resumo do Pedido
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-primary-600 font-medium">Grátis</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    R$ {cart.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="btn btn-primary w-full flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Finalizar Compra</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Pagamento 100% seguro e protegido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}