
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These values should come from environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User management
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Data fetching helpers
export const fetchMetricsForClient = async (clientId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('metrics')
    .select('*')
    .eq('client_id', clientId);
  
  if (startDate) {
    query = query.gte('date', startDate);
  }
  
  if (endDate) {
    query = query.lte('date', endDate);
  }
  
  const { data, error } = await query.order('date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchClientInfo = async (clientId: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateClientLogo = async (clientId: string, logoUrl: string) => {
  const { data, error } = await supabase
    .from('clients')
    .update({ logo_url: logoUrl })
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Admin functions
export const createUser = async (email: string, password: string, userData: any) => {
  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  
  if (authError) throw authError;
  
  // Then store additional user data
  if (authData.user) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        ...userData,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  return authData;
};

export const listAllClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};
