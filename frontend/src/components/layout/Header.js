'use client';

import Link from 'next/link';
import { useAuth } from '../../context/authContext';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Package, 
  LayoutDashboard,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout, isClient, isSeller } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-green rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              LuxeMarket
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Produtos
            </Link>

            {user ? (
              <>
                {isClient && (
                  <>
                    <Link 
                      href="/favorites" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Favoritos</span>
                    </Link>
                    <Link 
                      href="/cart" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Carrinho</span>
                    </Link>
                    <Link 
                      href="/orders" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      <span>Pedidos</span>
                    </Link>
                  </>
                )}

                {isSeller && (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      href="/my-products" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      <span>Meus Produtos</span>
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-green rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.email.split('@')[0]}
                    </span>
                    <span className="badge badge-green text-xs">
                      {user.role === 'CLIENT' ? 'Cliente' : 'Vendedor'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="btn btn-outline">
                  Entrar
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Criar Conta
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 fade-in">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/products" 
                className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </Link>

              {user ? (
                <>
                  {isClient && (
                    <>
                      <Link 
                        href="/favorites" 
                        className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Favoritos</span>
                      </Link>
                      <Link 
                        href="/cart" 
                        className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Carrinho</span>
                      </Link>
                      <Link 
                        href="/orders" 
                        className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>Pedidos</span>
                      </Link>
                    </>
                  )}

                  {isSeller && (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        href="/my-products" 
                        className="px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>Meus Produtos</span>
                      </Link>
                    </>
                  )}

                  <div className="px-4 py-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{user.email}</span>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-red-600 text-sm font-medium"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-4 flex flex-col space-y-2">
                  <Link 
                    href="/login" 
                    className="btn btn-outline w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn btn-primary w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}