# 🎓 Exemplos de Uso e Código

## 📊 Exemplos Práticos

### 1. Etiquetas de Produtos Alimentícios

```javascript
// Configuração típica
{
  base_fixo: "280000179",
  codigo_minerva: "21789",
  peso_liquido: "10",        // 10 kg
  data_producao: "18/08/2025",
  dias_validade: 150,        // 5 meses
  tara: "258",               // 258g
  rg_inicial: 1,
  rg_final: 500,
  nome_pdf: "lote_001_produtos.pdf"
}
```

**Resultado:** 500 etiquetas sequenciais para controle de lote

---

### 2. Inventário de Estoque

```javascript
// Múltiplos lotes
const lotes = [
  { rg_inicial: 1, rg_final: 100, nome_pdf: "lote_A.pdf" },
  { rg_inicial: 101, rg_final: 200, nome_pdf: "lote_B.pdf" },
  { rg_inicial: 201, rg_final: 300, nome_pdf: "lote_C.pdf" }
];

// Gerar cada lote
for (const lote of lotes) {
  await gerarPDF({ ...configBase, ...lote });
}
```

---

### 3. Rastreamento de Itens por Data

```javascript
// Gerar etiquetas com data específica
const hoje = new Date();
const dataFormatada = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;

const config = {
  // ... outros campos
  data_producao: dataFormatada,
  nome_pdf: `etiquetas_${hoje.toISOString().split('T')[0]}.pdf`
};
```

---

### 4. Diferentes Pesos

```javascript
// Produtos de pesos variados
const pesos = {
  pequeno: "5",    // 5 kg
  medio: "10",     // 10 kg
  grande: "15",    // 15 kg
  extra: "20"      // 20 kg
};

// Gerar para cada peso
Object.entries(pesos).forEach(([tamanho, peso]) => {
  gerarPDF({
    ...configBase,
    peso_liquido: peso,
    nome_pdf: `etiquetas_${tamanho}.pdf`
  });
});
```

---

## 💻 Código Avançado

### 1. Validação Personalizada

```typescript
// src/lib/validators.ts
export class BarcodeValidator {
  static validateRG(rg: number): boolean {
    return rg > 0 && rg < 100000000;
  }

  static validatePeso(peso: string): boolean {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    return pesoNum > 0 && pesoNum < 10000; // até 10 toneladas
  }

  static validateData(data: string): boolean {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(regex);
    
    if (!match) return false;
    
    const [, dia, mes, ano] = match;
    const date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    
    return date.getFullYear() === parseInt(ano) &&
           date.getMonth() === parseInt(mes) - 1 &&
           date.getDate() === parseInt(dia);
  }

  static validateConfig(config: BarcodeConfig): string[] {
    const errors: string[] = [];

    if (!this.validateRG(config.rg_inicial)) {
      errors.push('RG inicial inválido');
    }

    if (!this.validateRG(config.rg_final)) {
      errors.push('RG final inválido');
    }

    if (config.rg_inicial > config.rg_final) {
      errors.push('RG inicial deve ser menor que RG final');
    }

    if (!this.validatePeso(config.peso_liquido)) {
      errors.push('Peso líquido inválido');
    }

    if (!this.validateData(config.data_producao)) {
      errors.push('Data de produção inválida');
    }

    return errors;
  }
}

// Uso no componente
const errors = BarcodeValidator.validateConfig(config);
if (errors.length > 0) {
  setError(errors.join(', '));
  return;
}
```

---

### 2. Preview do Código de Barras

```typescript
// src/components/BarcodePreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { generateBarcodeWithText } from '@/lib/barcode-utils';
import { BarcodeConfig } from '@/types/barcode';

interface Props {
  config: BarcodeConfig;
}

export default function BarcodePreview({ config }: Props) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    // Gerar preview do primeiro código
    const codigo = generateBarcodeWithText(config, config.rg_inicial);
    setPreview(codigo);
  }, [config]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Preview do Primeiro Código
      </h3>
      <div className="font-mono text-sm bg-white p-3 rounded border">
        {preview}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {preview.length} caracteres
      </p>
    </div>
  );
}
```

---

### 3. Progresso de Geração

```typescript
// src/hooks/useProgressiveGeneration.ts
'use client';

import { useState } from 'react';
import { BarcodeConfig } from '@/types/barcode';

export function useProgressiveGeneration() {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (config: BarcodeConfig) => {
    setIsGenerating(true);
    setProgress(0);

    const total = config.rg_final - config.rg_inicial + 1;
    const batchSize = 100;

    for (let i = 0; i < total; i += batchSize) {
      const batchConfig = {
        ...config,
        rg_inicial: config.rg_inicial + i,
        rg_final: Math.min(config.rg_inicial + i + batchSize - 1, config.rg_final)
      };

      await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(batchConfig)
      });

      setProgress(Math.min(100, ((i + batchSize) / total) * 100));
    }

    setIsGenerating(false);
    setProgress(100);
  };

  return { generate, progress, isGenerating };
}

// Uso no componente
const { generate, progress, isGenerating } = useProgressiveGeneration();

return (
  <div>
    {isGenerating && (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
    <button onClick={() => generate(config)}>
      Gerar
    </button>
  </div>
);
```

---

### 4. Exportar Configuração

```typescript
// src/lib/config-export.ts
import { BarcodeConfig } from '@/types/barcode';

export class ConfigManager {
  static export(config: BarcodeConfig): string {
    return JSON.stringify(config, null, 2);
  }

  static import(jsonString: string): BarcodeConfig | null {
    try {
      return JSON.parse(jsonString) as BarcodeConfig;
    } catch {
      return null;
    }
  }

  static download(config: BarcodeConfig, filename: string = 'config.json') {
    const json = this.export(config);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  static upload(): Promise<BarcodeConfig | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          resolve(this.import(text));
        };
        reader.readAsText(file);
      };

      input.click();
    });
  }
}

// Uso
<button onClick={() => ConfigManager.download(config)}>
  Exportar Configuração
</button>

<button onClick={async () => {
  const imported = await ConfigManager.upload();
  if (imported) setConfig(imported);
}}>
  Importar Configuração
</button>
```

---

### 5. Histórico com Filtros

```typescript
// src/components/HistoryListAdvanced.tsx
'use client';

import { useState, useMemo } from 'react';
import { GenerationHistory } from '@/types/barcode';

export default function HistoryListAdvanced() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = history;

    // Filtro por data
    if (filter === 'today') {
      const today = new Date().toDateString();
      result = result.filter(h => 
        new Date(h.created_at!).toDateString() === today
      );
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter(h => 
        new Date(h.created_at!) >= weekAgo
      );
    }

    // Busca
    if (search) {
      result = result.filter(h =>
        h.config.base_fixo.includes(search) ||
        h.config.codigo_minerva.includes(search) ||
        h.total_etiquetas.toString().includes(search)
      );
    }

    return result;
  }, [history, filter, search]);

  return (
    <div>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full px-3 py-2 border rounded"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('today')}
            className={filter === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          >
            Hoje
          </button>
          <button
            onClick={() => setFilter('week')}
            className={filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
          >
            Última Semana
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(item => (
          <div key={item.id} className="border p-3 rounded">
            {/* Renderizar item */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 6. Batch Processing

```typescript
// src/lib/batch-processor.ts
import { BarcodeConfig } from '@/types/barcode';

export class BatchProcessor {
  static async processBatch(
    configs: BarcodeConfig[],
    onProgress?: (current: number, total: number) => void
  ) {
    const results = [];

    for (let i = 0; i < configs.length; i++) {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          body: JSON.stringify(configs[i])
        });

        const data = await response.json();
        results.push(data);

        if (onProgress) {
          onProgress(i + 1, configs.length);
        }

        // Delay entre requisições para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ error, config: configs[i] });
      }
    }

    return results;
  }
}

// Uso
const configs = [
  { /* config 1 */ },
  { /* config 2 */ },
  { /* config 3 */ }
];

await BatchProcessor.processBatch(configs, (current, total) => {
  console.log(`Processando ${current}/${total}`);
});
```

---

## 🎯 Casos de Uso Reais

### Farmácia/Drogaria

```javascript
const configFarmacia = {
  base_fixo: "280000179",
  codigo_minerva: "21789",
  peso_liquido: "0.5",  // 500g
  data_producao: "01/10/2025",
  dias_validade: 730,   // 2 anos
  tara: "50",           // 50g
  rg_inicial: 10000,
  rg_final: 10999,
  nome_pdf: "medicamentos_lote_X.pdf"
};
```

### Indústria Alimentícia

```javascript
const configAlimentos = {
  base_fixo: "280000179",
  codigo_minerva: "21789",
  peso_liquido: "25",   // 25 kg
  data_producao: "15/10/2025",
  dias_validade: 180,   // 6 meses
  tara: "500",          // 500g
  rg_inicial: 1,
  rg_final: 5000,
  nome_pdf: "alimentos_outubro_2025.pdf"
};
```

### Armazém/Logística

```javascript
const configLogistica = {
  base_fixo: "280000179",
  codigo_minerva: "21789",
  peso_liquido: "100",  // 100 kg
  data_producao: "20/10/2025",
  dias_validade: 365,   // 1 ano
  tara: "2000",         // 2 kg
  rg_inicial: 50000,
  rg_final: 50100,
  nome_pdf: "pallets_setor_A.pdf"
};
```

---

## 📚 Referências

### Formato Code128

- Suporta todos os caracteres ASCII
- Inclui dígito verificador automático
- Densidade alta (muitos dados em pouco espaço)
- Amplamente suportado por scanners

### Estrutura do Código Gerado

```
[BASE_FIXO][RG_8_DIGITOS][SUFIXO]

Onde SUFIXO = [MINERVA][01][PESO_5][DATA_8][VALIDADE_3][TARA_6]

Exemplo:
280000179 + 00000001 + 2178901010001808202515000258
= 28000017900000001217890101000180820251500000258
```

---

💡 **Dica:** Salve suas configurações favoritas em arquivos JSON para reutilizar!

🎓 **Aprenda mais:** Veja `CUSTOMIZATION.md` para modificações avançadas.
