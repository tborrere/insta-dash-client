
import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const SupabaseSetupGuide = () => {
  return (
    <Card className="mb-6 border-funillab-cyan/30">
      <CardContent className="pt-6">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Configuração do Supabase</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">Para conectar ao Supabase, configure as variáveis de ambiente:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Adicione a URL do seu projeto Supabase como <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code></li>
              <li>Adicione a chave anônima como <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code></li>
            </ol>
            <p className="mt-2 text-sm text-gray-600">
              Você pode encontrar essas informações no painel do Supabase em: 
              Configurações do Projeto &gt; API
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SupabaseSetupGuide;
