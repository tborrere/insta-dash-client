
import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ClientsTable from '@/components/ClientsTable';
import AddClientDialog from '@/components/AddClientDialog';
import SupabaseSetupGuide from '@/components/SupabaseSetupGuide';
import { useToast } from '@/components/ui/use-toast';
import { Users, Database, Key } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { toast } = useToast();

  const handleAddClient = () => {
    toast({
      title: "Cliente adicionado",
      description: "O novo cliente foi adicionado com sucesso.",
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
              <AddClientDialog onAddClient={handleAddClient} />
            </div>
            <Card>
              <CardContent className="p-0">
                <ClientsTable />
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
