
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthErrorAlert from './AuthErrorAlert';

interface AdminLoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loginError: string | null;
  loginLoading: boolean;
  onClearError: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSubmit,
  loginError,
  loginLoading,
  onClearError
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remover espaços em branco das extremidades
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    console.log('Enviando credenciais para login de admin:', {
      email: trimmedEmail,
      passwordLength: trimmedPassword.length
    });
    
    await onSubmit(trimmedEmail, trimmedPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-4">
        <AuthErrorAlert 
          error={loginError} 
          onDismiss={onClearError}
        />
        
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email do Administrador</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="admin@funillab.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-password">Senha</Label>
            <a 
              href="#" 
              className="text-xs text-funillab-cyan hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <Input
            id="admin-password"
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
          ) : "Acessar Dashboard"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default AdminLoginForm;
