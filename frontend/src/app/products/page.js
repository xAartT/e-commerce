'use client';

import { useState, useEffect } from 'react';
import { productsAPI, favoritesAPI, cartAPI } from '@/lib/api';
import { useAuth } from '../../context/authContext';
import { Search, Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProductsPage() {
  const { user, isClient } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await productsAPI.list({
        search: search || undefined,
        page,
        limit: 12,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleFavorite = async (productId, isFavorited) => {
    if (!isClient) {
      toast.error('Apenas clientes podem favoritar produtos');
      return;
    }

    try {
      if (isFavorited) {
        await favoritesAPI.remove(productId);
        toast.success('Removido dos favoritos');
      } else {
        await favoritesAPI.add(productId);
        toast.success('Adicionado aos favoritos');
      }
      fetchProducts(pagination.page);
    } catch (error) {
      toast.error('Erro ao favoritar produto');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isClient) {
      toast.error('Apenas clientes podem adicionar ao carrinho');
      return;
    }

    try {
      await cartAPI.add({ product_id: productId, quantity: 1 });
      toast.success('Adicionado ao carrinho!');
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Nossos <span className="gradient-text">Produtos</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Explore nossa coleção premium de produtos
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="input pl-12 pr-24 w-full text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-48 mb-4"></div>
              <div className="skeleton h-6 mb-2"></div>
              <div className="skeleton h-4 mb-4"></div>
              <div className="skeleton h-10"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Tente buscar com outros termos
          </p>
          <button
            onClick={() => {
              setSearch('');
              fetchProducts(1);
            }}
            className="btn btn-primary"
          >
            Ver Todos os Produtos
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="card card-hover group relative overflow-hidden"
              >
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
                  
                  {isClient && (
                    <button
                      onClick={() => handleFavorite(product.id, product.is_favorited)}
                      className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          product.is_favorited
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )}
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

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Vendido por: {product.seller_email?.split('@')[0]}
                  </p>

                  {isClient && (
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="btn btn-primary w-full flex items-center justify-center space-x-2 mt-4"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Adicionar ao Carrinho</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-outline disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                {[...Array(pagination.pages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => fetchProducts(page)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          page === pagination.page
                            ? 'bg-gradient-green text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.page - 2 ||
                    page === pagination.page + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn btn-outline disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <p className="text-center text-gray-600">
            Mostrando {products.length} de {pagination.total} produtos
          </p>
        </>
      )}
    </div>
  );
}