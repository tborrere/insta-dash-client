
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { getClientById } from '@/services/mockData';
import { User, LogOut, Home, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const clientInfo = user?.clientId ? getClientById(user.clientId) : null;
  const clientLogo = clientInfo?.logo_url;

  return (
    <header className="bg-gray-100 border-b border-gray-200 py-3 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Logo da Funil Lab para todos os usuários */}
        <img 
          src="/lovable-uploads/b1145979-e0b0-4c99-bfa2-760a739b778f.png" 
          alt="Funil Lab" 
          className="h-10 object-contain"
        />
        
        {/* Logo do cliente (se existir e o usuário for um cliente) */}
        {user?.role === 'client' && clientLogo && (
          <div className="h-9 border-l border-gray-300 pl-4">
            <img 
              src={clientLogo} 
              alt={`${clientInfo?.name} Logo`}
              className="h-full object-contain"
            />
          </div>
        )}
        
        {!clientLogo && !isAdmin() && (
          <h1 className="text-xl font-semibold text-funillab-blue ml-2">Métricas do Instagram</h1>
        )}
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <User className="h-4 w-4" />
              <span className="sr-only">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-muted-foreground">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
              <Home className="h-4 w-4 mr-2" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            
            {isAdmin() && (
              <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Painel Admin</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
