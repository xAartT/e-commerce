// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/authContext';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LuxeMarket - E-commerce Premium',
  description: 'A melhor plataforma de vendas online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}