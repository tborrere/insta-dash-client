
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Aqui você pode registrar o erro em um serviço de monitoramento
    console.error("Erro capturado pela ErrorBoundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Renderiza o fallback ou um componente de erro padrão
      if (typeof this.props.fallback === 'string') {
        return (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{this.props.fallback || "Ocorreu um erro inesperado."}</p>
              <p className="text-xs opacity-80">{this.state.error?.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start mt-2"
                onClick={this.handleReset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        );
      }
      
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p>Ocorreu um erro inesperado. Por favor, tente novamente.</p>
          <button 
            onClick={this.handleReset}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
