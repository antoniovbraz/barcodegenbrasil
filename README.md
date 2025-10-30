# 📦 Gerador de Códigos de Barras Sequenciais

Aplicação web moderna para gerar códigos de barras sequenciais em PDF, pronta para deploy no Vercel com integração ao Supabase.

## ✨ Funcionalidades

- ✅ Geração de códigos de barras Code128 em PDF
- ✅ Configuração completa de parâmetros (base fixa, código Minerva, peso, data, validade, tara, RG)
- ✅ Interface moderna e responsiva com Tailwind CSS
- ✅ Histórico de gerações salvo no Supabase
- ✅ Download automático do PDF gerado
- ✅ Suporte a até 1000 etiquetas por vez
- ✅ Layout otimizado (10cm x 7.5cm por etiqueta)

## 🚀 Deploy no Vercel

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd barCodeGen
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Supabase

Acesse seu projeto no [Supabase](https://supabase.com) e execute o SQL abaixo no SQL Editor:

```sql
-- Criar tabela de histórico de gerações
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL,
  total_etiquetas INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Criar índice para melhor performance
CREATE INDEX idx_generation_history_created_at ON generation_history(created_at DESC);

-- Habilitar Row Level Security (opcional)
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura e inserção (ajuste conforme necessário)
CREATE POLICY "Allow all operations" ON generation_history
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 4. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
```

**Onde encontrar as chaves:**
1. Acesse seu projeto no Supabase
2. Vá em **Settings** → **API**
3. Copie a **URL** e as chaves **anon/public** e **service_role**

### 5. Testar localmente

```bash
npm run dev
```

Acesse http://localhost:3000

### 6. Deploy no Vercel

#### Opção A: Via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com)
3. Clique em **Add New Project**
4. Importe seu repositório
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Clique em **Deploy**

#### Opção B: Via CLI

```bash
npm install -g vercel
vercel login
vercel
```

Durante o deploy, adicione as variáveis de ambiente quando solicitado.

## 📋 Como Usar

1. **Preencha os campos do formulário:**
   - Código Base Fixo (ex: 280000179)
   - Código Minerva (ex: 21789)
   - Peso Líquido em kg (ex: 10 ou 10.5)
   - Data de Produção no formato DD/MM/YYYY
   - Dias de Validade (ex: 150)
   - Tara em gramas (ex: 258)
   - RG Inicial e Final (define o range de etiquetas)
   - Nome do PDF de saída

2. **Clique em "Gerar Códigos de Barras"**

3. **O PDF será gerado e baixado automaticamente**

4. **O histórico ficará salvo no painel lateral**

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **bwip-js** - Geração de códigos de barras
- **jsPDF** - Criação de PDFs
- **Supabase** - Banco de dados PostgreSQL
- **Vercel** - Hospedagem e deploy

## 📊 Estrutura do Código

```
barCodeGen/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts   # API para gerar PDFs
│   │   │   └── history/route.ts    # API para histórico
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Página inicial
│   │   └── globals.css             # Estilos globais
│   ├── components/
│   │   ├── BarcodeForm.tsx         # Formulário de configuração
│   │   └── HistoryList.tsx         # Lista de histórico
│   ├── lib/
│   │   ├── barcode-utils.ts        # Utilitários
│   │   └── supabase.ts             # Cliente Supabase
│   └── types/
│       └── barcode.ts              # Tipos TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔒 Segurança

- As chaves do Supabase devem ser mantidas em variáveis de ambiente
- A `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta no frontend
- Row Level Security (RLS) pode ser configurado no Supabase para maior segurança

## 📝 Notas Importantes

- **Limite de etiquetas:** Máximo de 1000 por vez (limite do Vercel Hobby)
- **Tempo de execução:** 60 segundos máximo (limite do Vercel)
- **Formato da data:** Sempre DD/MM/YYYY
- **Peso líquido:** Pode usar vírgula ou ponto (10 ou 10,5 ou 10.5)

## 🐛 Problemas Comuns

### "Erro ao gerar PDF"
- Verifique se todos os campos estão preenchidos corretamente
- Certifique-se de que a data está no formato DD/MM/YYYY
- Reduza o número de etiquetas se estiver gerando muitas

### "Supabase não configurado"
- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Confirme que as chaves estão corretas

### PDF não baixa automaticamente
- Verifique as configurações de bloqueio de pop-ups do navegador
- Tente usar outro navegador

## 📞 Suporte

Se precisar de ajuda, verifique:
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Vercel](https://vercel.com/docs)

## 📄 Licença

Este projeto é de código aberto para uso pessoal e comercial.

---

Desenvolvido com ❤️ usando Next.js e Supabase
