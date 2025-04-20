
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthErrorAlert from './AuthErrorAlert';

interface ClientLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loginError: string | null;
  loginLoading: boolean;
  onClearError: () => void;
}

const ClientLoginForm: React.FC<ClientLoginFormProps> = ({
  onSubmit,
  loginError,
  loginLoading,
  onClearError
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-4">
        <AuthErrorAlert 
          error={loginError} 
          onDismiss={onClearError}
        />
        
        <div className="space-y-2">
          <Label htmlFor="client-email">Email do Cliente</Label>
          <Input
            id="client-email"
            type="email"
            placeholder="cliente@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="client-password">Senha</Label>
            <a 
              href="#" 
              className="text-xs text-funillab-cyan hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <Input
            id="client-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-[#021e4a] hover:bg-[#021e4a]/90 text-white" 
          disabled={loginLoading}
        >
          {loginLoading ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Entrando...
            </span>
          ) : "Acessar Métricas"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ClientLoginForm;
