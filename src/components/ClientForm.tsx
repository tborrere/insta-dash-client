
import React, { useState } from 'react';
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Instagram, Mail, User, Key, Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import LogoUpload from './LogoUpload';

// Schema de validação do formulário
const clientFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  instagram_id: z.string().min(1, 'ID do Instagram é obrigatório'),
  instagram_token: z.string().min(1, 'Token do Instagram é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: ClientFormValues & { logo?: File }) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [generatedPassword, setGeneratedPassword] = useState<string>(
    initialData?.id ? 'password123' : generateRandomPassword()
  );
  
  // Configuração do formulário com valores iniciais
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      instagram_id: initialData?.instagram_id || '',
      instagram_token: initialData?.instagram_token || '',
      password: generatedPassword,
    },
  });

  // Função para gerar senha aleatória
  function generateRandomPassword(length = 10) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  // Função para gerar nova senha
  const handleGenerateNewPassword = () => {
    const newPassword = generateRandomPassword();
    setGeneratedPassword(newPassword);
    form.setValue('password', newPassword);
  };

  // Função para copiar a senha para a área de transferência
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(form.getValues('password'));
    toast({
      title: 'Senha copiada',
      description: 'A senha foi copiada para a área de transferência.',
    });
  };

  // Função para lidar com o upload do logo
  const handleLogoUpload = async (file: File) => {
    setLogoFile(file);
    // Em um cenário real, este seria o momento de fazer upload para o Supabase Storage
    // e obter a URL pública do arquivo
  };

  // Função de submissão
  const handleSubmit = (data: ClientFormValues) => {
    onSubmit({
      ...data,
      logo: logoFile || undefined
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-funillab-blue">
          {initialData?.id ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <User className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Nome do cliente" {...field} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="email@exemplo.com" {...field} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Instagram</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <Instagram className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="ID do Instagram" {...field} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram_token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token de Acesso do Instagram</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                          <Key className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Token do Instagram" {...field} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <FormLabel>Logo do Cliente</FormLabel>
                  <div className="mt-1">
                    <LogoUpload
                      currentLogoUrl={null}
                      onLogoUpload={handleLogoUpload}
                      clientId={initialData?.id || 'new'}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha de Acesso</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="flex flex-1 items-center border rounded-l-md focus-within:ring-1 focus-within:ring-ring">
                            <Key className="ml-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Senha" 
                              {...field} 
                              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                              type="text"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-l-none"
                            onClick={handleCopyPassword}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex justify-between mt-1">
                        <FormMessage />
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={handleGenerateNewPassword}
                        >
                          Gerar nova senha
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-funillab-blue hover:bg-funillab-blue/90">
              {initialData?.id ? 'Atualizar Cliente' : 'Adicionar Cliente'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ClientForm;
