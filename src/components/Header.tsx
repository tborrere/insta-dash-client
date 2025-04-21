
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
import { User, LogOut, Home, Settings, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtém nome do cliente se existir
  const clientInfo = user?.clientId ? getClientById(user.clientId) : null;
  const clientName = clientInfo?.name;

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Logo Funil Lab centralizado */}
        <img 
          src="/lovable-uploads/b1145979-e0b0-4c99-bfa2-760a739b778f.png" 
          alt="Funil Lab" 
          className="h-12 object-contain"
        />
        {user?.role === 'client' && (
          <span className="ml-4 font-bold text-xl text-funillab-blue">
            {clientName}
          </span>
        )}
        {isAdmin() && (
          <h1 className="text-xl font-semibold text-funillab-blue ml-2">Métricas do Instagram</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isAdmin() && (
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="text-funillab-blue hover:text-funillab-blue/80 hover:bg-funillab-blue/10"
          >
            <Settings className="h-4 w-4 mr-1" />
            Painel Admin
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 items-center border-gray-200">
              <User className="h-4 w-4 text-funillab-blue" />
              <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
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
