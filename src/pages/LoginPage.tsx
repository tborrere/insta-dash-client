
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { Instagram } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro de login",
        description: "Email ou senha inválidos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/b1145979-e0b0-4c99-bfa2-760a739b778f.png" 
              alt="Funil Lab Logo" 
              className="h-24 w-auto" 
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Funil Lab</h1>
          <p className="text-gray-200">Painel de Métricas do Instagram</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta para visualizar suas métricas
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
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
                className="w-full bg-accent hover:bg-accent/90 text-primary" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full"></span>
                    Entrando...
                  </span>
                ) : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-300">
          <p>Para fins de demonstração, use:</p>
          <p className="mt-2">
            <strong>Admin:</strong> admin@funillab.com / admin123
          </p>
          <p>
            <strong>Cliente:</strong> cliente1@exemplo.com / cliente123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
