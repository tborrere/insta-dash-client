
import React from 'react';
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, RefreshCw, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ClientsTableProps {
  clients: Client[];
  onViewMetrics: (clientId: string) => void;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onViewMetrics,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();

  const handleRefreshToken = (clientId: string) => {
    toast({
      title: "Token sendo atualizado",
      description: "O token do Instagram será renovado em breve.",
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <Table>
      <TableCaption>Lista de clientes cadastrados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Instagram ID</TableHead>
          <TableHead>Status do Token</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.instagram_id}</TableCell>
            <TableCell>
              <Badge 
                variant={client.token_status === 'valid' ? 'default' : 'destructive'}
                className={client.token_status === 'valid' ? 'bg-green-500' : ''}
              >
                {client.token_status === 'valid' ? 'Válido' : 'Expirado'}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(client.created_at)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewMetrics(client.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Ver métricas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(client)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRefreshToken(client.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Renovar token</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(client.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
