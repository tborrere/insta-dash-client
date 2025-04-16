
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Instagram className="h-20 w-20 text-funillab-purple" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
        
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        
        <Button 
          onClick={() => navigate('/dashboard')} 
          size="lg"
          className="mx-auto"
        >
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
