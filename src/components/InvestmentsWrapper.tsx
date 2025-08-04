"use client";

import { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Plus } from 'lucide-react';

export default function InvestmentsWrapper() {
  const [investments] = useState([
    {
      id: '1',
      name: 'Tesouro Direto',
      type: 'Renda Fixa',
      amount: 5000,
      return: 12.5,
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Ações Petrobras',
      type: 'Renda Variável',
      amount: 3000,
      return: 8.2,
      date: '2024-02-01'
    },
    {
      id: '3',
      name: 'Fundos Imobiliários',
      type: 'Fundos',
      amount: 2500,
      return: 6.8,
      date: '2024-01-20'
    }
  ]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturn = investments.reduce((sum, inv) => sum + (inv.amount * inv.return / 100), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Meus Investimentos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Investido</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalInvested.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Retorno Total</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rentabilidade</p>
              <p className="text-2xl font-bold text-purple-600">
                {((totalReturn / totalInvested) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Investimentos Ativos</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {investments.map((investment) => (
            <div key={investment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{investment.name}</h4>
                  <p className="text-sm text-gray-600">{investment.type}</p>
                  <p className="text-xs text-gray-500">Investido em {new Date(investment.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    R$ {investment.amount.toLocaleString('pt-BR')}
                  </p>
                  <p className={`text-sm ${investment.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    +{investment.return}% de retorno
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 