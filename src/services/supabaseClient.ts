import { supabase } from '@/integrations/supabase/client';
import type { Client, Metric } from '../types/client';

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
    .from('metricas_instagram')
    .select('*')
    .eq('cliente_id', clientId);
  
  if (startDate) {
    query = query.gte('data', startDate);
  }
  
  if (endDate) {
    query = query.lte('data', endDate);
  }
  
  const { data, error } = await query.order('data', { ascending: true });
  
  if (error) throw error;
  
  // Mapeando para o formato esperado pelo frontend
  return data.map(item => ({
    id: item.id,
    client_id: item.cliente_id,
    date: item.data || '',
    reach: item.alcance || 0,
    impressions: item.impressoes || 0,
    likes: item.curtidas || 0,
    comments: item.comentarios || 0,
    followers: item.seguidores || 0,
    engagement: ((item.curtidas || 0) + (item.comentarios || 0)) / (item.alcance || 1) * 100
  })) as Metric[];
};

export const fetchClientInfo = async (clientId: string) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (error) throw error;
  
  // Mapeando para o formato esperado pelo frontend
  return {
    id: data.id,
    name: data.nome,
    email: data.email,
    instagram_id: data.instagram_id || '',
    instagram_token: data.token_instagram || '',
    token_status: data.token_instagram ? 'valid' : 'expired',
    created_at: data.criado_em || new Date().toISOString(),
    drive_url: data.drive_url,
    notion_url: data.notion_url,
    anuncios_url: data.anuncios_url,
    calendar_url: data.calendar_url
  } as Client;
};

export const updateClientLogo = async (clientId: string, logoUrl: string) => {
  // This function needs to be updated or removed as the logo_url field no longer exists
  // For now, we'll keep the function but update it to not set logo_url
  const { data, error } = await supabase
    .from('clientes')
    .update({})  // Removed logo_url update
    .eq('id', clientId)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.nome,
    email: data.email,
    instagram_id: data.instagram_id || '',
    instagram_token: data.token_instagram || '',
    token_status: data.token_instagram ? 'valid' : 'expired',
    created_at: data.criado_em || new Date().toISOString(),
    drive_url: data.drive_url,
    notion_url: data.notion_url,
    anuncios_url: data.anuncios_url,
    calendar_url: data.calendar_url
  } as Client;
};

// Admin functions
export const listAllClients = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  
  // Mapeando para o formato esperado pelo frontend
  return data.map(client => ({
    id: client.id,
    name: client.nome,
    email: client.email,
    instagram_id: client.instagram_id || '',
    instagram_token: client.token_instagram || '',
    token_status: client.token_instagram ? 'valid' : 'expired',
    created_at: client.criado_em || new Date().toISOString(),
    drive_url: client.drive_url,
    notion_url: client.notion_url,
    anuncios_url: client.anuncios_url,
    calendar_url: client.calendar_url
  })) as Client[];
};

export const createClient = async (clientData: {
  nome: string;
  email: string;
  senha: string;
  instagram_id?: string | null;
  token_instagram?: string | null;
  drive_url?: string | null;
  notion_url?: string | null;
  anuncios_url?: string | null;
  calendar_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([clientData])
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.nome,
    email: data.email,
    instagram_id: data.instagram_id || '',
    instagram_token: data.token_instagram || '',
    token_status: data.token_instagram ? 'valid' : 'expired',
    created_at: data.criado_em || new Date().toISOString(),
    drive_url: data.drive_url,
    notion_url: data.notion_url,
    anuncios_url: data.anuncios_url,
    calendar_url: data.calendar_url
  } as Client;
};

export const updateClient = async (clientId: string, updates: any) => {
  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.nome,
    email: data.email,
    instagram_id: data.instagram_id || '',
    instagram_token: data.token_instagram || '',
    token_status: data.token_instagram ? 'valid' : 'expired',
    created_at: data.criado_em || new Date().toISOString(),
    drive_url: data.drive_url,
    notion_url: data.notion_url,
    anuncios_url: data.anuncios_url,
    calendar_url: data.calendar_url
  } as Client;
};

export const deleteClient = async (clientId: string) => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', clientId);
    
  if (error) throw error;
  
  return true;
};
