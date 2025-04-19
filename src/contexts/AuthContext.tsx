import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .single();

    // 🧠 DEBUG PRA VER O QUE TÁ VINDO
    console.log('DATA:', data);
    console.log('ERRO:', error);
    console.log('SENHA DIGITADA:', password);
    console.log('SENHA NO BANCO:', data?.senha_hash);

    if (error || !data || data.senha_hash !== password) {
      throw new Error('Email ou senha inválidos');
    }

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

    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading
