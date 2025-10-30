'use client';

import { useState } from 'react';
import { BarcodeConfig } from '@/types/barcode';
import { isValidDate } from '@/lib/barcode-utils';
// @ts-ignore
import bwipjs from 'bwip-js';
// @ts-ignore
import { jsPDF } from 'jspdf';

const defaultConfig: BarcodeConfig = {
  base_fixo: '280000179',
  codigo_minerva: '21789',
  peso_liquido: '10',
  data_producao: '18/08/2025',
  dias_validade: 150,
  tara: '258',
  rg_inicial: 1,
  rg_final: 700,
  nome_pdf: 'etiquetas_layout_original.pdf',
};

export default function BarcodeForm() {
  const [config, setConfig] = useState<BarcodeConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (field: keyof BarcodeConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const validateForm = (): boolean => {
    if (!config.base_fixo || config.base_fixo.length < 5) {
      setError('Código Base Fixo inválido');
      return false;
    }

    if (!config.codigo_minerva || config.codigo_minerva.length < 3) {
      setError('Código Minerva inválido');
      return false;
    }

    if (!isValidDate(config.data_producao)) {
      setError('Data de Produção inválida (use DD/MM/YYYY)');
      return false;
    }

    if (config.rg_inicial > config.rg_final) {
      setError('RG Inicial deve ser menor ou igual ao RG Final');
      return false;
    }

    const total = config.rg_final - config.rg_inicial + 1;
    if (total > 2000) {
      setError('Máximo de 2000 etiquetas por vez');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress('Iniciando geração...');

    try {
      const totalEtiquetas = config.rg_final - config.rg_inicial + 1;
      const batchSize = 1000; // Processar 1000 por vez
      const batches = Math.ceil(totalEtiquetas / batchSize);

      setProgress(`Gerando ${totalEtiquetas} etiquetas em ${batches} arquivo(s) PDF...`);

      // Processar em lotes e gerar PDFs separados
      for (let batch = 0; batch < batches; batch++) {
        const batchStart = config.rg_inicial + (batch * batchSize);
        const batchEnd = Math.min(batchStart + batchSize - 1, config.rg_final);
        const batchTotal = batchEnd - batchStart + 1;

        setProgress(`Processando arquivo ${batch + 1} de ${batches} (${batchStart}-${batchEnd})...`);

        // Criar PDF para este lote
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [100, 75],
        });

        let isFirstPage = true;

        // Buscar códigos deste lote da API
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...config,
            rg_inicial: batchStart,
            rg_final: batchEnd,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao processar requisição');
        }

        setProgress(`Gerando códigos de barras do arquivo ${batch + 1}...`);

        // Gerar códigos de barras deste lote
        for (const item of data.codigos) {
          if (!isFirstPage) {
            pdf.addPage([100, 75], 'landscape');
          }
          isFirstPage = false;

          try {
            // Gerar código de barras usando canvas
            const canvas = document.createElement('canvas');
            bwipjs.toCanvas(canvas, {
              bcid: 'code128',
              text: item.codigo,
              scale: 3,
              height: 15,
              includetext: false,
            });

            const imgData = canvas.toDataURL('image/png');

            // Texto acima do código de barras
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(item.codigo, 50, 25, { align: 'center' });

            // Código de barras centralizado
            const imgWidth = 90;
            const imgHeight = 40;
            const x = (100 - imgWidth) / 2;
            const y = 30;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
          } catch (barcodeError) {
            console.error(`Erro ao gerar código ${item.rg}:`, barcodeError);
            continue;
          }
        }

        setProgress(`Salvando arquivo ${batch + 1} de ${batches}...`);

        // Download do PDF deste lote
        const fileName = batches > 1 
          ? `${config.nome_pdf.replace('.pdf', '')}_parte${batch + 1}.pdf`
          : config.nome_pdf || 'etiquetas.pdf';
        
        pdf.save(fileName);

        console.log(`Lote ${batch + 1}/${batches} concluído. ${batchTotal} etiquetas salvas em ${fileName}`);
      }

      setProgress('');

      // Salvar no histórico (opcional)
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config,
            totalEtiquetas,
            status: 'completed',
          }),
        });
      } catch (historyError) {
        console.error('Erro ao salvar histórico:', historyError);
      }

      setSuccess(true);
      setShowModal(true); // Mostrar o modal especial para a Luzilena!
    } catch (err) {
      setProgress('');
      setError(err instanceof Error ? err.message : 'Erro ao gerar PDF');
      console.error('Erro completo:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalEtiquetas = config.rg_final - config.rg_inicial + 1;

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código Base Fixo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código Base Fixo
          </label>
          <input
            type="text"
            value={config.base_fixo}
            onChange={(e) => handleChange('base_fixo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Código Minerva */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código Minerva
          </label>
          <input
            type="text"
            value={config.codigo_minerva}
            onChange={(e) => handleChange('codigo_minerva', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Peso Líquido */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso Líquido (kg)
          </label>
          <input
            type="text"
            value={config.peso_liquido}
            onChange={(e) => handleChange('peso_liquido', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10 ou 10.5"
            required
          />
        </div>

        {/* Data de Produção */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Produção (DD/MM/YYYY)
          </label>
          <input
            type="text"
            value={config.data_producao}
            onChange={(e) => handleChange('data_producao', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="18/08/2025"
            required
          />
        </div>

        {/* Dias de Validade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias de Validade
          </label>
          <input
            type="number"
            value={config.dias_validade}
            onChange={(e) => handleChange('dias_validade', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Tara */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tara (g)
          </label>
          <input
            type="text"
            value={config.tara}
            onChange={(e) => handleChange('tara', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* RG Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RG Inicial
          </label>
          <input
            type="number"
            value={config.rg_inicial}
            onChange={(e) => handleChange('rg_inicial', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* RG Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RG Final
          </label>
          <input
            type="number"
            value={config.rg_final}
            onChange={(e) => handleChange('rg_final', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Nome do PDF */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do PDF
          </label>
          <input
            type="text"
            value={config.nome_pdf}
            onChange={(e) => handleChange('nome_pdf', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Total de Etiquetas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900">
          Total de etiquetas a gerar: <span className="text-xl font-bold">{totalEtiquetas}</span>
        </p>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">PDF gerado e baixado com sucesso!</p>
        </div>
      )}

      {/* Progresso */}
      {loading && progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">{progress}</p>
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Gerando PDF...' : 'Gerar Códigos de Barras'}
      </button>
    </form>

    {/* Modal especial para a Luzilena */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-bounce-in">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉✨</div>
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              Parabéns, Luzilena!
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="text-lg font-medium">
                Seus códigos de barras foram gerados com sucesso! 🎊
              </p>
              <p className="text-base">
                Mais {config.rg_final - config.rg_inicial + 1} etiquetas prontinho! 
                Você é tipo uma impressora humana, só que melhor! 😄
              </p>
              <p className="text-sm text-gray-600 italic">
                (E nem precisou gritar com a impressora dessa vez! 🖨️💪)
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Valeu, maninho! 💜
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Feito com 💙 pelo seu irmão
            </p>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
