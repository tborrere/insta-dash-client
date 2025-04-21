
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from '@/types/client';
import { useToast } from '@/components/ui/use-toast';
import LogoUpload from './LogoUpload';
import { supabase } from '@/integrations/supabase/client';

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Client;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [instagramId, setInstagramId] = useState(initialData?.instagram_id || '');
  const [instagramToken, setInstagramToken] = useState(initialData?.instagram_token || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || 'https://via.placeholder.com/300x150?text=Cliente+Logo');
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setInstagramId(initialData.instagram_id);
      setInstagramToken(initialData.instagram_token);
      setPassword(''); // Reset password on edit
      setLogoUrl(initialData.logo_url || 'https://via.placeholder.com/300x150?text=Cliente+Logo');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setInstagramId('');
      setInstagramToken('');
      setLogoUrl('https://via.placeholder.com/300x150?text=Cliente+Logo');
    }
  }, [initialData]);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || (!initialData && !password)) {
      toast({
        title: "Dados incompletos",
        description: "Preencha os campos obrigatórios (nome, email, senha).",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Atualizar cliente existente
        const updates: any = {
          nome: name,
          email: email,
          instagram_id: instagramId || null,
          token_instagram: instagramToken || null,
          logo_url: logoUrl
        };
        
        // Se senha foi fornecida, atualiza senha
        if (password) {
          updates.senha = password;
        }
        
        const { error } = await supabase
          .from('clientes')
          .update(updates)
          .eq('id', initialData.id);
          
        if (error) throw error;
      } else {
        // Adicionar novo cliente
        const { error } = await supabase
          .from('clientes')
          .insert([
            {
              nome: name,
              email: email,
              senha: password,  // Senha em texto puro
              instagram_id: instagramId || null,
              token_instagram: instagramToken || null,
              logo_url: logoUrl,
              criado_em: new Date().toISOString()
            }
          ]);
          
        if (error) throw error;
      }
      
      toast({
        title: initialData ? "Cliente atualizado" : "Cliente criado",
        description: initialData ? "Cliente atualizado com sucesso." : "Cliente criado com sucesso."
      });
      
      onSave();
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
            <DialogDescription>
              {initialData 
                ? 'Edite as informações do cliente existente.' 
                : 'Preencha os dados para adicionar um novo cliente.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <Label>Logo do Cliente</Label>
              <LogoUpload
                currentLogoUrl={logoUrl}
                onLogoUpload={handleLogoUpload}
                clientId={initialData?.id || 'new'}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                placeholder={initialData ? "Deixe em branco para manter atual" : "Digite a senha do cliente"}
                {...(!initialData && { required: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instagram-id" className="text-right">
                Instagram ID
              </Label>
              <Input
                id="instagram-id"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instagram-token" className="text-right">
                Token de Acesso
              </Label>
              <Input
                id="instagram-token"
                value={instagramToken}
                onChange={(e) => setInstagramToken(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Adicionar cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
