'use client';

import { useState, useEffect } from 'react';
import { favoritesAPI, cartAPI } from '@/lib/api';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await favoritesAPI.list();
      setFavorites(data.favorites);
    } catch (error) {
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await favoritesAPI.remove(productId);
      fetchFavorites();
      toast.success('Removido dos favoritos');
    } catch (error) {
      toast.error('Erro ao remover favorito');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.add({ product_id: productId, quantity: 1 });
      toast.success('Adicionado ao carrinho!');
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-48 mb-4"></div>
              <div className="skeleton h-6 mb-2"></div>
              <div className="skeleton h-4 mb-4"></div>
              <div className="skeleton h-10"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nenhum favorito ainda
        </h2>
        <p className="text-gray-600 mb-8">
          Adicione produtos aos favoritos para encontrá-los facilmente
        </p>
        <button
          onClick={() => router.push('/products')}
          className="btn btn-primary"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Meus <span className="gradient-text">Favoritos</span>
        </h1>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="card card-hover group relative">
            <div className="relative h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300" />
                </div>
              )}

              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="pt-2">
                <span className="text-2xl font-bold text-primary-600">
                  R$ {parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Vendido por: {product.seller_email?.split('@')[0]}
              </p>

              <button
                onClick={() => handleAddToCart(product.id)}
                className="btn btn-primary w-full flex items-center justify-center space-x-2 mt-4"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}