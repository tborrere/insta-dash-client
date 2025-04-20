
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
      <AlertDescription className="flex justify-between items-center">
        <span>{error}</span>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-xs underline"
          >
            Fechar
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AuthErrorAlert;
