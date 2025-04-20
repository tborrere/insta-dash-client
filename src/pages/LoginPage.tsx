
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User } from 'lucide-react';
import ClientLoginForm from '@/components/auth/ClientLoginForm';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const LoginPage: React.FC = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (email: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);

    try {
      await login(email, password);
    } catch (error: any) {
      console.error('Erro de login:', error);
      setLoginError(error.message || 'Email ou senha inválidos. Tente novamente.');
      toast({
        title: "Erro de login",
        description: error.message || "Email ou senha inválidos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const clearLoginError = () => {
    setLoginError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3] p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/b1145979-e0b0-4c99-bfa2-760a739b778f.png" 
              alt="Funil Lab Logo" 
              className="h-24 w-auto" 
            />
          </div>
          <p className="text-gray-600 mt-2">Painel de Métricas do Instagram</p>
        </div>

        <ErrorBoundary fallback="Ocorreu um erro no formulário de login">
          <Card className="shadow-lg border-gray-200">
            <CardHeader className="bg-white text-gray-900 border-b border-gray-100">
              <CardTitle className="text-center text-xl">Login</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Acesse sua conta para visualizar suas métricas
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="grid grid-cols-2 w-full rounded-none">
                <TabsTrigger 
                  value="client" 
                  className="text-sm data-[state=active]:bg-[#021e4a]/10 data-[state=active]:text-[#021e4a]"
                >
                  <User className="h-4 w-4 mr-2" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="text-sm data-[state=active]:bg-[#021e4a]/10 data-[state=active]:text-[#021e4a]"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Administrador
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="mt-0">
                <ClientLoginForm
                  onSubmit={handleSubmit}
                  loginError={loginError}
                  loginLoading={loginLoading}
                  onClearError={clearLoginError}
                />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-0">
                <AdminLoginForm
                  onSubmit={handleSubmit}
                  loginError={loginError}
                  loginLoading={loginLoading}
                  onClearError={clearLoginError}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </ErrorBoundary>

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
