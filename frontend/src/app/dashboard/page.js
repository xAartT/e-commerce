// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { sellerAPI } from '@/lib/api';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingBag,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await sellerAPI.getDashboard();
      setStats(data.dashboard);
    } catch (error) {
      toast.error('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-12 w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Produtos Vendidos',
      value: stats?.total_sold || 0,
      icon: ShoppingBag,
      color: 'green',
      bgColor: 'bg-primary-500',
    },
    {
      title: 'Faturamento Total',
      value: `R$ ${parseFloat(stats?.total_revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'gold',
      bgColor: 'bg-gold-500',
    },
    {
      title: 'Produto Mais Vendido',
      value: stats?.top_product?.sold || 0,
      subtitle: stats?.top_product?.name || 'Nenhum',
      icon: Award,
      color: 'purple',
      bgColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-600">
            Visão geral do seu negócio
          </p>
        </div>
        
        <Link href="/my-products" className="btn btn-primary">
          <Package className="w-5 h-5 mr-2" />
          Gerenciar Produtos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                {stat.subtitle && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${stat.bgColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? stat.value : 50))}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.total_products === 0 && (
        <div className="card bg-gradient-green text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Bem-vindo ao seu Dashboard!
              </h3>
              <p className="opacity-90 mb-4">
                Comece cadastrando seus primeiros produtos para começar a vender
              </p>
              <Link href="/my-products" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Cadastrar Produtos
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Card */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Performance de Vendas
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Taxa de Conversão</span>
              <span className="font-semibold text-primary-600">
                {stats?.total_products > 0 
                  ? ((stats.total_sold / stats.total_products) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ticket Médio</span>
              <span className="font-semibold text-primary-600">
                R$ {stats?.total_sold > 0
                  ? (stats.total_revenue / stats.total_sold).toFixed(2)
                  : '0.00'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Produtos Ativos</span>
              <span className="font-semibold text-primary-600">
                {stats?.total_products || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          
          <div className="space-y-3">
            <Link 
              href="/my-products" 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Gerenciar Produtos</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link 
              href="/my-products" 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Adicionar Produto</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link 
              href="/products" 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Ver Loja</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}