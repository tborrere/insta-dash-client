
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClientsTable from '@/components/ClientsTable';
import AddClientDialog from '@/components/AddClientDialog';
import SupabaseSetupGuide from '@/components/SupabaseSetupGuide';
import { useToast } from '@/components/ui/use-toast';
import { Users, Database, Key } from 'lucide-react';
import { Client } from '@/types/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listAllClients } from '@/services/supabaseClient';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Fetch clients using React Query
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: listAllClients
  });

  // Handle refresh when the component mounts or after operations
  const refreshClients = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] });
  };

  const handleAddClient = () => {
    setIsAddClientDialogOpen(false);
    setSelectedClient(null);
    refreshClients();
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsAddClientDialogOpen(true);
  };

  const openDeleteDialog = (clientId: string) => {
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clientToDelete);
        
      if (error) throw error;
      
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
      
      refreshClients();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao remover cliente",
        description: error.message || "Ocorreu um erro ao tentar remover o cliente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleViewMetrics = (clientId: string) => {
    navigate(`/dashboard?client=${clientId}`);
  };

  // Check if role is admin, if not redirect to login
  React.useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

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
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-funillab-blue"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    Erro ao carregar clientes. Por favor, tente novamente.
                  </div>
                ) : (
                  <ClientsTable 
                    clients={clients} 
                    onViewMetrics={handleViewMetrics}
                    onEdit={handleEditClient}
                    onDelete={openDeleteDialog}
                  />
                )}
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

      {/* Confirmation dialog for deleting clients */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente e todos os seus dados serão permanentemente excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
