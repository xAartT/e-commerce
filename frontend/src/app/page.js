'use client';

import Link from 'next/link';
import { ShoppingBag, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-green opacity-5 rounded-3xl"></div>
        <div className="relative text-center py-20 px-4">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium animate-bounce">
            🎉 Plataforma Premium de E-commerce
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Bem-vindo ao{' '}
            <span className="gradient-text">LuxeMarket</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma mais moderna para comprar e vender produtos premium. 
            Segurança, qualidade e facilidade em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Explorar Produtos</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register" className="btn btn-outline text-lg px-8 py-4">
              Criar Conta Grátis
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <p className="text-gray-600">Produtos Disponíveis</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1000+</div>
              <p className="text-gray-600">Clientes Satisfeitos</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold gradient-text mb-2">98%</div>
              <p className="text-gray-600">Avaliação Positiva</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a <span className="gradient-text">LuxeMarket</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oferecemos a melhor experiência de compra e venda online
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card card-hover text-center">
            <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rápido e Fácil</h3>
            <p className="text-gray-600">
              Compre ou venda em poucos cliques. Interface intuitiva e moderna.
            </p>
          </div>

          <div className="card card-hover text-center">
            <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">100% Seguro</h3>
            <p className="text-gray-600">
              Suas informações protegidas com criptografia de ponta.
            </p>
          </div>

          <div className="card card-hover text-center">
            <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Dashboard completo para vendedores acompanharem suas vendas.
            </p>
          </div>

          <div className="card card-hover text-center">
            <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Produtos Premium</h3>
            <p className="text-gray-600">
              Catálogo curado com produtos de alta qualidade.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl">
        <div className="bg-gradient-green p-12 md:p-20 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já confiam na LuxeMarket
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
              Criar Conta Grátis
            </Link>
            <Link href="/products" className="btn bg-primary-700 text-white hover:bg-primary-800 text-lg px-8 py-4">
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 pt-12 pb-8 text-center text-gray-600">
        <p className="text-sm">
          Desenvolvido por Artur Bresolin
        </p>
      </footer>
    </div>
  );
}