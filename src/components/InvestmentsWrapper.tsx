"use client";

import { useState, useEffect } from 'react';
import {  ExternalLink } from 'lucide-react';

// Componente de loading
const LoadingComponent = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    <span className="ml-3 text-gray-600">Carregando investimentos...</span>
  </div>
);

// Componente de erro
const ErrorComponent = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-red-500 text-2xl mb-2">⚠️</div>
      <p className="text-gray-600 mb-2">Erro ao carregar investimentos</p>
      <p className="text-sm text-gray-500">{error}</p>
    </div>
  </div>
);


export default function InvestmentsWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Verificar se o microfrontend está disponível
    const checkMicrofrontend = async () => {
      try {
        const response = await fetch('http://localhost:3001', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        setIsLoading(false);
      } catch (error) {
        console.log('Microfrontend não disponível');
        setUseFallback(true);
        setIsLoading(false);
      }
    };

    // Aguardar um pouco antes de verificar
    const timer = setTimeout(checkMicrofrontend, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }


  if (hasError) {
    return <ErrorComponent error="Erro ao conectar com o microfrontend" />;
  }

  return (
    <div className="space-y-6">
     
      
      <div className="bg-white rounded-lg overflow-hidden">
        <iframe
          src="http://localhost:3001"
          className="w-full h-[70vh] border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          title="Investimentos Microfrontend"
        />
      </div>
    </div>
  );
} 