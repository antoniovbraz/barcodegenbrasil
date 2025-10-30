# ⚡ Quick Start - Comece em 5 Minutos!

## 🎯 Objetivo

Ter a aplicação rodando localmente o mais rápido possível.

---

## 🚀 3 Passos Simples

### 1️⃣ Instalar (2 min)

```powershell
# Baixar projeto
git clone https://github.com/seu-usuario/barcode-generator.git
cd barcode-generator

# Instalar dependências
npm install
```

### 2️⃣ Configurar (2 min)

```powershell
# Criar arquivo de ambiente
copy .env.example .env.local

# Editar (opcional para testar localmente)
# Se quiser histórico, configure Supabase
# Se não, apenas gere PDFs
notepad .env.local
```

### 3️⃣ Rodar (1 min)

```powershell
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🎉 Pronto!

Você pode:
- ✅ Preencher formulário
- ✅ Gerar códigos de barras
- ✅ Baixar PDF

**Histórico só funciona com Supabase configurado** (opcional para testes)

---

## 📝 Dados de Teste

Cole estes valores no formulário:

```
Código Base Fixo: 280000179
Código Minerva: 21789
Peso Líquido: 10
Data de Produção: 18/08/2025
Dias de Validade: 150
Tara: 258
RG Inicial: 1
RG Final: 10
Nome do PDF: teste.pdf
```

Clique em **Gerar Códigos de Barras** → PDF baixa automaticamente!

---

## 🔧 Configurar Supabase (Opcional)

Se quiser o histórico funcionando:

### 1. Criar conta Supabase
- https://supabase.com
- Criar projeto (2 min)

### 2. Executar SQL
- SQL Editor → Cole `supabase-setup.sql` → Run

### 3. Copiar credenciais
- Settings → API → Copiar URL e chaves

### 4. Colar em .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
```

### 5. Reiniciar
```powershell
# Parar (Ctrl+C)
# Rodar novamente
npm run dev
```

---

## 🌐 Deploy no Vercel (Opcional)

Quer colocar online?

### 1. Push para GitHub
```powershell
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/barcode-generator.git
git push -u origin main
```

### 2. Importar no Vercel
- https://vercel.com/new
- Import repository
- Add environment variables (do .env.local)
- Deploy!

**Guia completo:** Veja `STEP-BY-STEP.md`

---

## 📚 Documentação Completa

- 📖 **README.md** - Visão geral
- 📦 **INSTALLATION.md** - Instalação detalhada
- 🚀 **STEP-BY-STEP.md** - Deploy passo a passo
- 🔧 **TROUBLESHOOTING.md** - Resolver problemas
- 🎨 **CUSTOMIZATION.md** - Personalizar
- 📊 **COMPARISON.md** - vs Python
- 📋 **SUMMARY.md** - Resumo executivo

---

## 🆘 Problemas?

### "Cannot find module"
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### "Port 3000 in use"
```powershell
$env:PORT=3001; npm run dev
```

### Outros problemas
📖 Leia `TROUBLESHOOTING.md`

---

## ✅ Checklist Rápido

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Aplicação rodando (`npm run dev`)
- [ ] Aberto em http://localhost:3000
- [ ] Gerou PDF de teste

**Tudo OK?** Você está pronto! 🎉

---

## 🎯 Próximos Passos

1. Testar com seus dados reais
2. Personalizar cores/layout
3. Fazer deploy no Vercel
4. Compartilhar com equipe

---

**Tempo total:** 5 minutos ⚡  
**Dificuldade:** Fácil 😊  
**Resultado:** Aplicação funcionando 🚀

**Happy coding!** 💻✨
