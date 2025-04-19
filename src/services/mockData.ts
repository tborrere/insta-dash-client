
import type { Client } from '@/types/client';

// Dados mock de clientes para testes
const clients: Client[] = [
  {
    id: '1',
    name: 'Empresa A',
    email: 'cliente1@exemplo.com',
    instagram_id: 'empresa_a',
    logo_url: '/placeholder.svg',
    calendar_url: 'https://calendar.google.com/calendar/embed?src=c_9d3f7a915dbdb1a9ca0ceed81e45c80ba37f78660f0e2d666d667a8a19087b42%40group.calendar.google.com',
    created_at: new Date().toISOString(),
    token_status: 'valid',
  },
  {
    id: '2',
    name: 'Empresa B',
    email: 'cliente2@exemplo.com',
    instagram_id: 'empresa_b',
    logo_url: '/placeholder.svg',
    calendar_url: 'https://calendar.google.com/calendar/embed?src=c_9d3f7a915dbdb1a9ca0ceed81e45c80ba37f78660f0e2d666d667a8a19087b42%40group.calendar.google.com',
    created_at: new Date().toISOString(),
    token_status: 'expired',
  },
];

// Função para obter um cliente pelo ID
export const getClientById = (id: string): Client | undefined => {
  return clients.find(client => client.id === id);
};

// Função para obter todos os clientes
export const getAllClients = (): Client[] => {
  return clients;
};

export default {
  getClientById,
  getAllClients,
};
