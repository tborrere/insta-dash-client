
import React, { useState } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/constants';

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoUpload: (file: File) => Promise<void>;
  clientId: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogoUrl,
  onLogoUpload,
  clientId,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validar o tipo de arquivo
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor selecione uma imagem no formato PNG ou JPG.",
        variant: "destructive",
      });
      return;
    }

    // Validar o tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Criar URL de preview para exibição imediata
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Chamar a função para fazer upload
      await onLogoUpload(file);
      
      toast({
        title: "Logo atualizado",
        description: "O logotipo foi enviado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer upload do logo:", error);
      setPreviewUrl(currentLogoUrl || null); // Restaurar logo anterior em caso de erro
      
      toast({
        title: "Erro ao enviar logo",
        description: "Não foi possível enviar o logo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Aqui você chamaria a função para remover o logo do servidor
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Logo do Cliente"
                className="h-24 object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white hover:bg-destructive/90"
                onClick={handleRemoveLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/50">
              <p className="text-sm text-muted-foreground">
                Nenhum logo selecionado
              </p>
            </div>
          )}
          
          <div className="grid w-full">
            <input
              ref={fileInputRef}
              type="file"
              id={`logo-upload-${clientId}`}
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className="w-full"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  Enviando...
                </span>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {previewUrl ? "Alterar logo" : "Enviar logo"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoUpload;
