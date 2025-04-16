
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ClientsTable from '@/components/ClientsTable';
import AddClientDialog from '@/components/AddClientDialog';
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

const AdminPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(getAllClients());
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewMetrics = (clientId: string) => {
    // In a real app, this would navigate to a client-specific dashboard
    // For this demo, we'll just show a toast
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

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'created_at' | 'token_status'>) => {
    if (selectedClient) {
      // Update existing client
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id 
          ? { 
              ...client, 
              ...clientData 
            } 
          : client
      );
      setClients(updatedClients);
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } else {
      // Add new client
      const newClient: Client = {
        id: `client${clients.length + 1}`,
        ...clientData,
        token_status: 'valid',
        created_at: new Date().toISOString(),
      };
      setClients([...clients, newClient]);
      toast({
        title: "Cliente adicionado",
        description: "O novo cliente foi adicionado com sucesso.",
      });
    }
    setSelectedClient(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-gray-600">
              Gerencie os clientes e suas métricas do Instagram
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedClient(undefined);
              setIsAddClientOpen(true);
            }}
            className="flex items-center gap-2"
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
      <AddClientDialog 
        isOpen={isAddClientOpen}
        onClose={() => {
          setIsAddClientOpen(false);
          setSelectedClient(undefined);
        }}
        onSave={handleSaveClient}
        initialData={selectedClient}
      />

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
