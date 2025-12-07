'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao parsear usuário:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
      
      setUser(data.user);
      toast.success('Login realizado com sucesso!');
      
      if (data.user.role === 'SELLER') {
        router.push('/dashboard');
      } else {
        router.push('/products');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password, role) => {
    try {
      const { data } = await authAPI.register({ email, password, role });
      
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
      
      setUser(data.user);
      toast.success('Conta criada com sucesso!');
      
      if (data.user.role === 'SELLER') {
        router.push('/dashboard');
      } else {
        router.push('/products');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    toast.success('Logout realizado');
    router.push('/login');
  };

  const deleteAccount = async () => {
    try {
      await authAPI.deleteAccount();
      Cookies.remove('token');
      Cookies.remove('user');
      setUser(null);
      toast.success('Conta deletada com sucesso');
      router.push('/');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao deletar conta';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const deactivateAccount = async () => {
    try {
      await authAPI.deactivateAccount();
      Cookies.remove('token');
      Cookies.remove('user');
      setUser(null);
      toast.success('Conta desativada com sucesso');
      router.push('/');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao desativar conta';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        deleteAccount,
        deactivateAccount,
        isAuthenticated: !!user,
        isClient: user?.role === 'CLIENT',
        isSeller: user?.role === 'SELLER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};