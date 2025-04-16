
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ClientsTable from '@/components/ClientsTable';
import ClientForm from '@/components/ClientForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAllClients } from '@/services/mockData';
import { Client } from '@/types/client';
import { PlusCircle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const AdminPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(getAllClients());
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewMetrics = (clientId: string) => {
    // Em uma aplicação real, você poderia querer ter uma rota específica para cada cliente
    // Por exemplo: /clients/client_id/dashboard
    toast({
      title: "Visualizando métricas",
      description: `Redirecionando para as métricas do cliente ${clientId}...`,
    });
    navigate('/dashboard');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsAddClientOpen(true);
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!clientToDelete) return;
    
    // Remove client from list
    setClients(clients.filter(client => client.id !== clientToDelete));
    
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso.",
    });
    
    setIsDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleSaveClient = (clientData: any) => {
    // Em um caso real, faríamos uma chamada à API para salvar no banco de dados
    
    if (selectedClient) {
      // Atualizar cliente existente
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id 
          ? { 
              ...client, 
              ...clientData,
              logo_url: clientData.logo ? URL.createObjectURL(clientData.logo) : client.logo_url,
            } 
          : client
      );
      setClients(updatedClients);
      
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } else {
      // Adicionar novo cliente
      const logoUrl = clientData.logo ? URL.createObjectURL(clientData.logo) : undefined;
      
      const newClient: Client = {
        id: `client${clients.length + 1}`,
        name: clientData.name,
        email: clientData.email,
        instagram_id: clientData.instagram_id,
        instagram_token: clientData.instagram_token,
        token_status: 'valid',
        created_at: new Date().toISOString(),
        logo_url: logoUrl,
      };
      
      setClients([...clients, newClient]);
      
      toast({
        title: "Cliente adicionado",
        description: `O novo cliente "${clientData.name}" foi adicionado com sucesso. As credenciais de acesso foram geradas.`,
      });
    }
    
    setIsAddClientOpen(false);
    setSelectedClient(undefined);
  };

  const handleCloseDialog = () => {
    setIsAddClientOpen(false);
    setSelectedClient(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-funillab-blue">Painel Administrativo</h1>
            <p className="text-funillab-gray">
              Gerencie os clientes e suas métricas do Instagram
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedClient(undefined);
              setIsAddClientOpen(true);
            }}
            className="flex items-center gap-2 bg-funillab-blue hover:bg-funillab-blue/90"
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>

        <div className="bg-white rounded-md shadow-sm">
          <ClientsTable 
            clients={clients}
            onViewMetrics={handleViewMetrics}
            onEdit={handleEditClient}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>

      {/* Add/Edit Client Dialog */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <ClientForm
            initialData={selectedClient}
            onSubmit={handleSaveClient}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá remover permanentemente 
              o cliente e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
