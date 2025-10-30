# 🎨 Personalizações e Melhorias

## Personalizações Disponíveis

### 1. Alterar Tamanho das Etiquetas

No arquivo `src/app/api/generate/route.ts`, linha 38:

```typescript
// Tamanho atual: 10cm x 7.5cm
const pdf = new jsPDF({
  orientation: 'landscape',
  unit: 'mm',
  format: [100, 75], // Altere aqui [largura, altura] em mm
});
```

### 2. Modificar Aparência dos Códigos

No arquivo `src/app/api/generate/route.ts`, linha 54:

```typescript
const pngBuffer = await bwipjs.toBuffer({
  bcid: 'code128',        // Tipo de código de barras
  text: codigoCompleto,
  scale: 3,               // Escala (aumentar = maior qualidade)
  height: 15,             // Altura do código de barras
  includetext: false,     // Mostrar texto embaixo do código
  textxalign: 'center',   // Alinhamento do texto
});
```

### 3. Alterar Cores e Estilo

No arquivo `tailwind.config.ts`, adicione suas cores:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      // Adicione suas cores aqui
    },
  },
},
```

### 4. Aumentar Limite de Etiquetas

⚠️ **Atenção:** O Vercel Hobby tem limite de 60s de execução.

No arquivo `src/app/api/generate/route.ts`, linha 29:

```typescript
// Limite de segurança
if (totalEtiquetas > 1000) { // Altere aqui
  return NextResponse.json(
    { error: 'Máximo de 1000 etiquetas por vez' },
    { status: 400 }
  );
}
```

## 🚀 Melhorias Sugeridas

### 1. Adicionar Autenticação

Usar Supabase Auth para controlar acesso:

```typescript
// src/lib/auth.ts
import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
```

### 2. Salvar PDFs no Supabase Storage

```typescript
// src/lib/storage.ts
import { supabase } from './supabase';

export async function uploadPDF(
  pdfBuffer: Buffer,
  fileName: string
) {
  const { data, error } = await supabase.storage
    .from('pdfs')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from('pdfs')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
```

### 3. Adicionar Validação de Código de Barras

```typescript
// src/lib/validators.ts
export function validateBarcode(code: string): boolean {
  // Implementar algoritmo de validação (dígito verificador)
  // Exemplo: Código EAN-13, Code128, etc.
  return code.length > 0;
}

export function calculateCheckDigit(code: string): number {
  // Implementar cálculo do dígito verificador
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}
```

### 4. Adicionar Múltiplos Layouts

```typescript
// src/types/barcode.ts
export type LayoutType = 'original' | 'compact' | 'detailed';

export interface BarcodeConfig {
  // ... campos existentes
  layout: LayoutType;
}
```

### 5. Exportar para Outros Formatos

```typescript
// src/app/api/export/route.ts
export async function POST(request: NextRequest) {
  const { config, format } = await request.json();
  
  switch (format) {
    case 'excel':
      // Gerar Excel com biblioteca xlsx
      break;
    case 'csv':
      // Gerar CSV
      break;
    case 'json':
      // Gerar JSON
      break;
  }
}
```

### 6. Adicionar Fila de Processamento

Para grandes volumes, usar Vercel Edge Functions ou Redis:

```typescript
// Usar BullMQ ou similar
import Queue from 'bull';

const barcodeQueue = new Queue('barcode-generation', {
  redis: process.env.REDIS_URL,
});

barcodeQueue.process(async (job) => {
  const { config } = job.data;
  // Processar geração
});
```

### 7. Adicionar Analytics

```typescript
// src/lib/analytics.ts
export function trackGeneration(config: BarcodeConfig) {
  // Google Analytics, Plausible, ou outro
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_barcode', {
      total_etiquetas: config.rg_final - config.rg_inicial + 1,
    });
  }
}
```

### 8. Modo Escuro

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
```

## 🔧 Configurações Avançadas

### Otimizar Geração de PDF

```typescript
// Gerar em paralelo (cuidado com memória)
const promises = [];
for (let i = 0; i < batches; i++) {
  promises.push(generateBatch(i));
}
await Promise.all(promises);
```

### Adicionar Cache

```typescript
// Usar Redis ou Vercel KV
import { kv } from '@vercel/kv';

export async function getCachedBarcode(key: string) {
  return await kv.get(key);
}

export async function setCachedBarcode(key: string, value: any) {
  await kv.set(key, value, { ex: 3600 }); // 1 hora
}
```

### Webhook para Notificações

```typescript
// src/app/api/webhook/route.ts
export async function POST(request: NextRequest) {
  const { event, data } = await request.json();
  
  // Enviar email, SMS, ou notificação
  if (event === 'generation_completed') {
    await sendEmail(data.email, 'PDF pronto!');
  }
}
```

## 📊 Monitoramento

### Adicionar Sentry

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Logs Estruturados

```typescript
// src/lib/logger.ts
export function log(level: 'info' | 'error', message: string, meta?: any) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  }));
}
```

## 🎯 Testes

### Testes Unitários com Jest

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

```typescript
// src/lib/__tests__/barcode-utils.test.ts
import { generateBarcodeWithText } from '../barcode-utils';

describe('Barcode Utils', () => {
  it('should generate correct barcode', () => {
    const config = {
      base_fixo: '280000179',
      // ... outros campos
    };
    const result = generateBarcodeWithText(config, 1);
    expect(result).toContain('280000179');
  });
});
```

### Testes E2E com Playwright

```bash
npm install -D @playwright/test
```

```typescript
// tests/e2e/barcode.spec.ts
import { test, expect } from '@playwright/test';

test('should generate barcode PDF', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input[name="base_fixo"]', '280000179');
  // ... preencher outros campos
  await page.click('button[type="submit"]');
  
  // Verificar download
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('.pdf');
});
```

## 📝 Documentação da API

Para criar uma API pública:

```typescript
// src/app/api/v1/generate/route.ts
/**
 * @swagger
 * /api/v1/generate:
 *   post:
 *     summary: Gera códigos de barras em PDF
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base_fixo:
 *                 type: string
 *               rg_inicial:
 *                 type: number
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 */
```

## 🔐 Segurança Adicional

### Rate Limiting

```typescript
// src/middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

### CORS Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
        ],
      },
    ];
  },
};
```

---

💡 **Dica:** Implemente melhorias gradualmente e teste cada uma antes de fazer deploy em produção!
