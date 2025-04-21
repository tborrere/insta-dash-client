import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ClientsTable from '@/components/ClientsTable';
import AddClientDialog from '@/components/AddClientDialog';
import SupabaseSetupGuide from '@/components/SupabaseSetupGuide';
import { useToast } from '@/components/ui/use-toast';
import { Users, Database, Key } from 'lucide-react';
import { Client } from '@/types/client';
import { useQuery } from '@tanstack/react-query';
import { listAllClients } from '@/services/supabaseClient';
import { Button } from '@/components/ui/button';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (localStorage.getItem('role') !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Mock clients data for development
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Cliente Exemplo 1',
      email: 'cliente1@exemplo.com',
      instagram_id: 'cliente1_insta',
      instagram_token: 'token123',
      token_status: 'valid',
      created_at: '2025-03-15T10:00:00Z',
      logo_url: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Cliente Exemplo 2',
      email: 'cliente2@exemplo.com',
      instagram_id: 'cliente2_insta',
      instagram_token: 'token456',
      token_status: 'expired',
      created_at: '2025-02-10T10:00:00Z'
    }
  ];

  const handleAddClient = () => {
    setIsAddClientDialogOpen(false);
    toast({
      title: "Cliente adicionado",
      description: "O novo cliente foi adicionado com sucesso.",
    });
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsAddClientDialogOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    // In a real app, this would call an API to delete the client
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
  };

  const handleViewMetrics = (clientId: string) => {
    // In a real app, this would navigate to the client's metrics page
    toast({
      title: "Visualizando métricas",
      description: `Redirecionando para métricas do cliente ID: ${clientId}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-funillab-blue">Painel de Administração</h1>
            <p className="text-gray-600">Gerencie clientes, usuários e configurações</p>
          </div>
        </div>
        
        <SupabaseSetupGuide />
        
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="clients" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Banco de Dados</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span>Tokens API</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-funillab-blue">Gerenciar Clientes</h2>
              <Button onClick={() => setIsAddClientDialogOpen(true)}>
                Adicionar Cliente
              </Button>
              {isAddClientDialogOpen && (
                <AddClientDialog 
                  isOpen={isAddClientDialogOpen} 
                  onClose={() => {
                    setIsAddClientDialogOpen(false);
                    setSelectedClient(null);
                  }}
                  onSave={handleAddClient}
                  initialData={selectedClient || undefined}
                />
              )}
            </div>
            <Card>
              <CardContent className="p-0">
                <ClientsTable 
                  clients={mockClients} 
                  onViewMetrics={handleViewMetrics}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClient}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Banco de Dados</CardTitle>
                <CardDescription>
                  Gerencie as tabelas e dados do sistema de métricas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Esta área permitirá gerenciar o esquema do banco de dados e visualizar dados agregados.
                  Configure sua conexão com o Supabase para ativar esta funcionalidade.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Tokens de API do Instagram</CardTitle>
                <CardDescription>
                  Gerencie os tokens de acesso para coletar métricas do Instagram
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Essa área permitirá gerenciar e visualizar os tokens de API do Instagram para cada cliente.
                  Configure sua conexão com o Supabase para ativar esta funcionalidade.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
