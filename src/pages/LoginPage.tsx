
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('client'); // Default to client login
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Redirect based on user role
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
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
    <div className="min-h-screen flex items-center justify-center bg-funillab-dark p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/b1145979-e0b0-4c99-bfa2-760a739b778f.png" 
              alt="Funil Lab Logo" 
              className="h-32 w-auto" 
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Funil Lab</h1>
          <p className="text-gray-300">Painel de Métricas do Instagram</p>
        </div>

        <Card className="shadow-lg border-gray-700 overflow-hidden">
          <CardHeader className="bg-gray-800 text-white border-b border-gray-700">
            <CardTitle className="text-center text-xl">Login</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Acesse sua conta para visualizar suas métricas
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="client" value={loginType} onValueChange={setLoginType} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-none">
              <TabsTrigger value="client" className="text-sm data-[state=active]:bg-funillab-cyan/20 data-[state=active]:text-funillab-cyan">
                <User className="h-4 w-4 mr-2" />
                Cliente
              </TabsTrigger>
              <TabsTrigger value="admin" className="text-sm data-[state=active]:bg-funillab-cyan/20 data-[state=active]:text-funillab-cyan">
                <Shield className="h-4 w-4 mr-2" />
                Administrador
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="client" className="mt-0">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
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
                    className="w-full bg-funillab-cyan hover:bg-funillab-cyan/90 text-funillab-dark" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-funillab-dark border-t-transparent rounded-full"></span>
                        Entrando...
                      </span>
                    ) : "Acessar Métricas"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin" className="mt-0">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email de Administrador</Label>
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
                    <Label htmlFor="admin-password">Senha</Label>
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
                    className="w-full bg-funillab-cyan hover:bg-funillab-cyan/90 text-funillab-dark" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-funillab-dark border-t-transparent rounded-full"></span>
                        Entrando...
                      </span>
                    ) : "Acessar Painel de Controle"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-400">
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
