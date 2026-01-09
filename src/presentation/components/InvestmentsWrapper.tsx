"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { logger } from "@/shared/lib/logger";

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
        const response = await fetch("https://investiment-mf.vercel.app/", {
          method: "HEAD",
          mode: "no-cors",
        });
        setIsLoading(false);
      } catch (error) {
        logger.log("Microfrontend não disponível");
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

  if (useFallback) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Meus Investimentos
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Microfrontend Indisponível
          </h3>
          <p className="text-gray-600 mb-4">
            O microfrontend de investimentos não está disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Meus Investimentos</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <iframe
          src="https://investiment-mf.vercel.app/"
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
