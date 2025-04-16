
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthState, User } from '../types/auth';

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

// Mock users for demo purposes - In a real app, this would come from your backend
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
    // Check for saved session on app load
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
        console.error('Failed to parse saved user:', error);
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
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call to your backend
    return new Promise<void>((resolve, reject) => {
      // Simulate API delay
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
          
          // Save to localStorage (in a real app, would use secure cookies/tokens)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Email ou senha inválidos'));
        }
      }, 500);
    });
  };

  const logout = () => {
    // Clear authentication state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Remove from localStorage
    localStorage.removeItem('user');
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
