'use client';

import { useEffect, useState } from 'react';
import { GenerationHistory } from '@/types/barcode';

export default function HistoryList() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando histórico...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum histórico de geração ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Histórico de Gerações</h2>
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">
                  {formatDate(item.created_at)}
                </p>
                <p className="font-medium text-gray-900">
                  RG {item.config.rg_inicial} - {item.config.rg_final}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {item.total_etiquetas} etiquetas
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Base: {item.config.base_fixo}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Minerva: {item.config.codigo_minerva}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Peso: {item.config.peso_liquido} kg
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status === 'completed'
                    ? 'Concluído'
                    : item.status === 'error'
                    ? 'Erro'
                    : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
