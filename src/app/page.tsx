import BarcodeForm from '@/components/BarcodeForm';
import HistoryList from '@/components/HistoryList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gerador de Códigos de Barras
          </h1>
          <p className="text-gray-600">
            Gere códigos de barras sequenciais em PDF de forma rápida e fácil
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Configuração
              </h2>
              <BarcodeForm />
            </div>
          </div>

          {/* Histórico */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <HistoryList />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Gerador de Códigos de Barras</p>
        </div>
      </div>
    </main>
  );
}
