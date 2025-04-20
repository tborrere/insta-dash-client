
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demonstração (vamos usar em caso de falha na autenticação com Supabase)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@funillab.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'cliente1@exemplo.com',
    password: 'cliente123',
    name: 'Cliente 1',
    role: 'client' as const,
    clientId: 'client1',
    instagramId: 'client1_instagram',
  },
  {
    id: '3',
    email: 'cliente2@exemplo.com',
    password: 'cliente123',
    name: 'Cliente 2',
    role: 'client' as const,
    clientId: 'client2',
    instagramId: 'client2_instagram',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    // Configurar o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Usuário autenticado
          const { user } = session;
          
          // Aqui assumimos que o usuário é cliente por padrão
          // Em uma implementação real, você consultaria o perfil do usuário para determinar a função
          const userWithRole: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || user.email?.split('@')[0] || 'Usuário',
            role: user.email?.includes('admin') ? 'admin' : 'client',
            clientId: user.id, // temporário, assumindo que id do usuário é o mesmo do cliente
          };
          
          setAuthState({
            user: userWithRole,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Salvar no localStorage para persistência de sessão
          localStorage.setItem('user', JSON.stringify(userWithRole));
        } else {
          // Usuário não autenticado
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('user');
        }
      }
    );

    // Verificar se há uma sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const { user } = session;
        
        // Aqui assumimos que o usuário é cliente por padrão
        const userWithRole: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata.name || user.email?.split('@')[0] || 'Usuário',
          role: user.email?.includes('admin') ? 'admin' : 'client',
          clientId: user.id,
        };
        
        setAuthState({
          user: userWithRole,
          isAuthenticated: true,
          isLoading: false,
        });
        
        localStorage.setItem('user', JSON.stringify(userWithRole));
      } else {
        // Verificar se existe um usuário salvo no localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser) as User;
            setAuthState({
              user: parsedUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            console.error('Falha ao analisar o usuário salvo:', error);
            localStorage.removeItem('user');
            setAuthState({
              ...initialAuthState,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            ...initialAuthState,
            isLoading: false,
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Primeiro tenta autenticar com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // A autenticação foi bem-sucedida e o onAuthStateChange cuidará da atualização do estado
      return;
    } catch (supabaseError) {
      console.warn('Falha na autenticação com Supabase, tentando autenticação simulada:', supabaseError);
      
      // Fallback para autenticação simulada
      return new Promise<void>((resolve, reject) => {
        // Simular atraso de API
        setTimeout(() => {
          const user = MOCK_USERS.find(
            (u) => u.email === email && u.password === password
          );

          if (user) {
            // Remove password from user object
            const { password: _, ...userWithoutPassword } = user;
            
            // Update authentication state
            setAuthState({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            resolve();
          } else {
            reject(new Error('Email ou senha inválidos'));
          }
        }, 500);
      });
    }
  };

  const logout = async () => {
    try {
      // Tenta fazer logout do Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Erro ao fazer logout do Supabase:', error);
    } finally {
      // Limpar o estado de autenticação local independentemente do resultado
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Remover do localStorage
      localStorage.removeItem('user');
    }
  };

  const isAdmin = () => {
    return authState.user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
