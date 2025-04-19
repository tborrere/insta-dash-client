
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type Role = 'admin' | 'client';

interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
  clientId?: string;
  instagramId?: string;
  logo?: string;
  calendar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao parsear usuário salvo:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Busca o cliente pelo email
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Dados retornados pelo Supabase:', data);
      
      if (error) {
        console.error('Erro ao buscar cliente:', error);
        throw new Error('Email ou senha inválidos');
      }

      if (!data || data.senha_hash !== password) {
        console.error('Credenciais inválidas:', { 
          email, 
          senhaDigitada: password, 
          senhaNoBanco: data?.senha_hash 
        });
        throw new Error('Email ou senha inválidos');
      }

      // Cria objeto de usuário autenticado
      const userData: User = {
        id: data.id,
        email: data.email,
        role: 'client',
        name: data.nome,
        clientId: data.id,
        instagramId: data.instagram_id,
        logo: data.logo_url,
        calendar: data.calendar_url,
      };

      // Atualiza o estado e salva no localStorage
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Login realizado com sucesso:', userData);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a), ${userData.name || userData.email}!`,
      });

    } catch (error: any) {
      console.error('Erro durante login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    console.log('Logout realizado');
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return context;
};
