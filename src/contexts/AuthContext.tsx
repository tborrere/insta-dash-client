
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
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
      
      // Primeiro teste: verificar se a tabela clientes existe e está acessível
      const { data: tableCheck, error: tableError } = await supabase
        .from('clientes')
        .select('count(*)')
        .limit(1);
        
      if (tableError) {
        console.error('Erro ao verificar tabela clientes:', tableError);
        throw new Error(`Erro ao acessar banco de dados: ${tableError.message}`);
      }
      
      console.log('Tabela clientes acessível:', tableCheck);
      
      // Modificamos a consulta para não usar .single() diretamente
      // Isso evita o erro quando não encontra nenhum registro
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email);

      console.log('Resposta completa do Supabase:', { data, error });
      
      if (error) {
        console.error('Erro ao buscar cliente:', error);
        throw new Error(`Erro na consulta: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.error('Nenhum usuário encontrado com email:', email);
        throw new Error('Usuário não encontrado. Verifique o email informado.');
      }
      
      // Usamos o primeiro resultado (deveria ser único pelo email)
      const clienteData = data[0];
      
      console.log('Cliente encontrado:', clienteData);
      console.log('Senha digitada:', JSON.stringify(password));
      console.log('Senha no banco:', JSON.stringify(clienteData.senha_hash));
      
      // Verificação de senha simplificada
      if (clienteData.senha_hash !== password) {
        console.error('Senha incorreta:', {
          senhaDigitada: password,
          senhaNoBanco: clienteData.senha_hash
        });
        throw new Error('Senha incorreta. Tente novamente.');
      }

      // Cria objeto de usuário autenticado
      const userData: User = {
        id: clienteData.id,
        email: clienteData.email,
        role: 'client',
        name: clienteData.nome,
        clientId: clienteData.id,
        instagramId: clienteData.instagram_id,
        logo: clienteData.logo_url,
        calendar: clienteData.calendar_url,
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
