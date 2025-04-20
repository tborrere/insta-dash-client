
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AuthErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

const AuthErrorAlert: React.FC<AuthErrorAlertProps> = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro de autenticação</AlertTitle>
      <AlertDescription className="flex flex-col">
        <div className="flex justify-between items-center">
          <span className="font-medium">{error}</span>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-xs underline ml-2"
              type="button"
            >
              Fechar
            </button>
          )}
        </div>
        <div className="text-xs mt-2">
          Se o problema persistir, tente limpar o cache do navegador ou entre em contato com o suporte.
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AuthErrorAlert;
