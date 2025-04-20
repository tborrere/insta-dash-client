
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        console.log('Usuário recuperado do localStorage:', JSON.parse(savedUser));
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
      console.log('Tentando login com:', { email, password });
      
      // Busca o cliente pelo email - com tratamento de erro aprimorado
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Dados retornados pelo Supabase:', data);
      
      if (error) {
        console.error('Erro ao buscar cliente:', error);
        
        // Mensagem de erro mais detalhada
        if (error.code === 'PGRST116') {
          throw new Error('Usuário não encontrado. Verifique o email informado.');
        } else {
          throw new Error(`Erro na autenticação: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('Email não encontrado');
      }
      
      if (data.senha_hash !== password) {
        console.error('Senha incorreta:', { 
          email, 
          senhaDigitada: password, 
          senhaNoBanco: data?.senha_hash 
        });
        throw new Error('Senha incorreta. Tente novamente.');
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
      toast({
        title: "Erro de login",
        description: error.message || "Ocorreu um erro durante o login",
        variant: "destructive",
      });
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
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
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
