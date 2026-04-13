import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-900 mb-4 text-center">Oups ! Une erreur est survenue.</h1>
          <p className="text-slate-500 mb-8 text-center max-w-md">Nous sommes désolés, un problème technique inattendu s'est produit.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-tbm-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors"
            >
              Réessayer
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors"
            >
              Retour accueil
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
