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

interface AddClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'created_at' | 'token_status'>) => void;
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
  const [instagramId, setInstagramId] = useState(initialData?.instagram_id || '');
  const [instagramToken, setInstagramToken] = useState(initialData?.instagram_token || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setInstagramId(initialData.instagram_id);
      setInstagramToken(initialData.instagram_token);
    } else {
      setName('');
      setEmail('');
      setInstagramId('');
      setInstagramToken('');
    }
  }, [initialData]);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !instagramId || !instagramToken) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSave({
        name,
        email,
        instagram_id: instagramId,
        instagram_token: instagramToken,
        logo_url: initialData?.logo_url || 'https://via.placeholder.com/150'
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                currentLogoUrl={initialData?.logo_url}
                onLogoUpload={(file) => console.log('Logo uploaded:', file)}
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
              <Label htmlFor="instagram-id" className="text-right">
                Instagram ID
              </Label>
              <Input
                id="instagram-id"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                className="col-span-3"
                required
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
                required
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
