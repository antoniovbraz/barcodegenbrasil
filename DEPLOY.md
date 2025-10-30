# Guia Rápido de Deploy

## 🚀 Passos Simplificados

### 1. Supabase (2 minutos)

1. Acesse https://supabase.com
2. Crie um novo projeto (ou use existente)
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de `supabase-setup.sql`
5. Clique em **Run**
6. Vá em **Settings** → **API** e copie:
   - Project URL
   - anon/public key
   - service_role key

### 2. Vercel (3 minutos)

#### Opção A: Interface Web

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em **Add New** → **Project**
4. Importe este repositório
5. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=cole_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_aqui
   SUPABASE_SERVICE_ROLE_KEY=cole_aqui
   ```
6. Clique em **Deploy**

#### Opção B: CLI

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir instruções e adicionar as variáveis de ambiente
```

### 3. Testar

1. Acesse a URL fornecida pelo Vercel
2. Preencha o formulário
3. Clique em "Gerar Códigos de Barras"
4. O PDF será baixado automaticamente

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Criar arquivo .env.local
cp .env.example .env.local

# Editar .env.local com suas credenciais do Supabase

# Rodar localmente
npm run dev

# Acessar http://localhost:3000
```

## 📦 Build de Produção

```bash
# Gerar build
npm run build

# Testar build localmente
npm start
```

## ❓ Problemas Comuns

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Supabase não configurado"
- Verifique se as variáveis de ambiente estão corretas no Vercel
- Vá em **Project Settings** → **Environment Variables**

### PDF não gera
- Verifique se todos os campos estão preenchidos
- Data deve estar no formato DD/MM/YYYY
- Máximo de 1000 etiquetas por vez

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar autenticação com Supabase Auth
- [ ] Salvar PDFs no Supabase Storage
- [ ] Adicionar suporte a múltiplos layouts
- [ ] Criar API para integração com outros sistemas
- [ ] Adicionar testes automatizados

## 📞 Precisa de Ajuda?

- Documentação Next.js: https://nextjs.org/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação Vercel: https://vercel.com/docs
