# 🔧 Guia de Solução de Problemas

## 🚨 Problemas Comuns e Soluções

### 1. Erro: "Cannot find module"

**Sintomas:**
```
Error: Cannot find module 'next'
Error: Cannot find module '@supabase/supabase-js'
```

**Causa:** Dependências não instaladas

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou com yarn
rm -rf node_modules yarn.lock
yarn install
```

---

### 2. Erro: "Supabase não configurado"

**Sintomas:**
- API retorna erro 500
- Histórico não carrega
- Console mostra: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Causa:** Variáveis de ambiente não configuradas

**Solução Local:**
```bash
# 1. Criar arquivo .env.local
cp .env.example .env.local

# 2. Editar .env.local com suas credenciais
# NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
# SUPABASE_SERVICE_ROLE_KEY=sua-chave-aqui

# 3. Reiniciar servidor
npm run dev
```

**Solução Vercel:**
1. Vá em **Project Settings** → **Environment Variables**
2. Adicione as 3 variáveis
3. Faça redeploy: `vercel --prod`

---

### 3. PDF não é gerado

**Sintomas:**
- Botão fica "carregando" indefinidamente
- Erro no console
- Nenhum download acontece

**Possíveis Causas e Soluções:**

#### A) Validação falhou
```
✅ Verifique:
- Data no formato DD/MM/YYYY (ex: 18/08/2025)
- RG Inicial menor ou igual ao RG Final
- Todos os campos preenchidos
- Números válidos (sem letras)
```

#### B) Timeout (mais de 60 segundos)
```
⚠️ Reduza o número de etiquetas:
- Máximo de 1000 no Vercel Hobby
- Tente gerar em lotes menores
```

#### C) Erro no código de barras
```
🔍 Verifique no console do navegador (F12):
- Procure por erros em vermelho
- Copie a mensagem de erro
```

---

### 4. Histórico não aparece

**Sintomas:**
- Painel de histórico vazio
- Mensagem "Nenhum histórico de geração ainda"

**Soluções:**

#### A) Verificar tabela no Supabase
```sql
-- Execute no SQL Editor do Supabase
SELECT * FROM generation_history ORDER BY created_at DESC LIMIT 10;
```

Se retornar erro "relation does not exist":
```sql
-- Execute o script completo em supabase-setup.sql
```

#### B) Verificar políticas RLS
```sql
-- Ver políticas
SELECT * FROM pg_policies WHERE tablename = 'generation_history';

-- Se não tiver nenhuma, criar:
CREATE POLICY "Allow all operations" ON generation_history
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

### 5. Erro de Build no Vercel

**Sintomas:**
```
Error: Build failed
Type error: ...
```

**Soluções:**

#### A) Erro de tipo TypeScript
```bash
# Verificar localmente
npm run build

# Corrigir erros mostrados
# Depois fazer commit e push
```

#### B) Dependências faltando
```json
// Verificar package.json
{
  "dependencies": {
    "next": "14.1.0",
    "@supabase/supabase-js": "^2.39.3",
    "bwip-js": "^4.1.1",
    "jspdf": "^2.5.1"
    // ... todas presentes?
  }
}
```

#### C) Node version incorreta
```json
// Adicionar em package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

### 6. Download não funciona

**Sintomas:**
- PDF é gerado mas não baixa
- Arquivo baixado está corrompido
- Browser bloqueia download

**Soluções:**

#### A) Verificar bloqueador de pop-ups
```
✅ Desabilitar bloqueador de pop-ups para o site
✅ Permitir downloads automáticos
```

#### B) Testar em outro browser
```
✅ Chrome
✅ Firefox
✅ Edge
✅ Safari
```

#### C) Verificar console
```javascript
// Procure por erros tipo:
// "Failed to fetch"
// "Network error"
// "CORS error"
```

---

### 7. Código de barras ilegível

**Sintomas:**
- Código de barras muito pequeno
- Scanner não lê
- Imagem pixelada

**Soluções:**

#### A) Aumentar qualidade
Em `src/app/api/generate/route.ts`:
```typescript
const pngBuffer = await bwipjs.toBuffer({
  bcid: 'code128',
  text: codigoCompleto,
  scale: 5,        // Aumentar de 3 para 5
  height: 20,      // Aumentar de 15 para 20
});
```

#### B) Aumentar tamanho no PDF
```typescript
const imgWidth = 95;   // Aumentar de 90
const imgHeight = 45;  // Aumentar de 40
```

---

### 8. Erro: "Rate limit exceeded"

**Sintomas:**
```
Error: Too many requests
429 Too Many Requests
```

**Causa:** Muitas requisições em pouco tempo

**Solução:**
```
⏰ Aguarde alguns minutos
🔄 Não clique múltiplas vezes no botão
📊 Gere em lotes menores
```

---

### 9. Erro no Supabase

**Sintomas:**
```
Error: Invalid API key
Error: Project not found
```

**Soluções:**

#### A) Verificar URL e chaves
```bash
# Ir em Supabase → Settings → API
# Copiar novamente:
# - URL
# - anon/public key
# - service_role key

# Colar no .env.local ou Vercel
```

#### B) Verificar status do Supabase
```
🌐 https://status.supabase.com
```

#### C) Recriar cliente
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis existem
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10));
```

---

### 10. Performance lenta

**Sintomas:**
- Geração demora muito
- Browser trava
- Timeout

**Soluções:**

#### A) Reduzir número de etiquetas
```
✅ Gere no máximo 500 por vez
✅ Divida em múltiplos PDFs
```

#### B) Otimizar imagens
```typescript
// Reduzir escala se não precisar de alta qualidade
scale: 2,  // Em vez de 3
```

#### C) Usar servidor mais potente
```
💰 Upgrade para Vercel Pro (mais memória/CPU)
```

---

## 🛠️ Ferramentas de Debug

### 1. Console do Navegador (F12)

```javascript
// Ver requisições
Network → Filter: Fetch/XHR

// Ver erros
Console → Procure linhas vermelhas

// Ver dados
Application → Local Storage
```

### 2. Logs do Vercel

```bash
# Via CLI
vercel logs

# Via Dashboard
Vercel → Project → Deployments → Click em deployment → Logs
```

### 3. SQL Editor do Supabase

```sql
-- Ver dados
SELECT * FROM generation_history ORDER BY created_at DESC;

-- Ver estatísticas
SELECT 
  COUNT(*) as total,
  SUM(total_etiquetas) as total_etiquetas,
  DATE(created_at) as dia
FROM generation_history
GROUP BY DATE(created_at)
ORDER BY dia DESC;

-- Limpar tabela (CUIDADO!)
-- TRUNCATE TABLE generation_history;
```

---

## 📞 Ainda com Problemas?

### 1. Coletar Informações

```
✅ Browser e versão
✅ Sistema operacional
✅ Mensagem de erro completa
✅ Screenshot do console (F12)
✅ Dados de exemplo que causam erro
```

### 2. Verificar Documentação

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [bwip-js Docs](https://github.com/metafloor/bwip-js)

### 3. Testar em Ambiente Limpo

```bash
# Clone em nova pasta
git clone <repo> teste-limpo
cd teste-limpo

# Instale do zero
npm install

# Configure variáveis
cp .env.example .env.local
# Edite .env.local

# Teste
npm run dev
```

### 4. Comparar com Código Original

```bash
# Ver diferenças
git diff HEAD~1

# Reverter mudanças
git checkout -- .

# Voltar para commit anterior
git reset --hard HEAD~1
```

---

## ✅ Checklist de Validação

Antes de abrir issue ou pedir ajuda:

- [ ] Reinstalei dependências (`rm -rf node_modules && npm install`)
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] Tabela criada no Supabase
- [ ] Build local funciona (`npm run build`)
- [ ] Console do browser não mostra erros
- [ ] Testei em outro browser
- [ ] Verifiquei logs do Vercel
- [ ] Dados de entrada estão corretos
- [ ] Li toda a documentação (README.md)

---

## 🎯 Casos Especiais

### Código Python vs Web tem resultados diferentes

**Verificar:**
1. Mesmo formato de data
2. Mesma formatação de peso
3. Mesmas configurações de tara
4. Mesmo range de RG

**Teste:**
```typescript
// Adicionar logs em generate/route.ts
console.log('Config:', config);
console.log('Código gerado:', codigoCompleto);

// Comparar com output do Python
```

### Quero gerar mais de 1000 etiquetas

**Opções:**
1. Gerar múltiplos PDFs (1-1000, 1001-2000, etc)
2. Usar script Python original para grandes volumes
3. Fazer upgrade para Vercel Pro (aumenta limites)
4. Implementar geração em lote com fila

---

💡 **Lembre-se:** 90% dos problemas são resolvidos por:
1. Reinstalar dependências
2. Configurar variáveis de ambiente
3. Verificar formato dos dados de entrada

🤝 **Contribua:** Se encontrou e resolveu um problema não listado aqui, considere documentá-lo!
