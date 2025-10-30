# 🛠️ Comandos Úteis e Scripts

## 🚀 Comandos Principais

### Desenvolvimento
```powershell
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Rodar em outra porta
$env:PORT=3001; npm run dev

# Limpar e reinstalar
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Build e Deploy
```powershell
# Build de produção
npm run build

# Rodar build localmente
npm start

# Verificar erros
npm run lint

# Corrigir erros automaticamente
npm run lint -- --fix
```

### Git
```powershell
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "Descrição da mudança"

# Push
git push origin main

# Ver histórico
git log --oneline

# Criar branch
git checkout -b feature/nova-funcionalidade

# Mudar de branch
git checkout main

# Merge
git merge feature/nova-funcionalidade
```

### Supabase
```powershell
# Instalar CLI (opcional)
npm install -g supabase

# Login
supabase login

# Link com projeto
supabase link --project-ref seu-projeto-ref

# Rodar migrations
supabase db push
```

### Vercel
```powershell
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs
```

---

## 🔧 Scripts Personalizados

### Script de Setup Automático (Windows PowerShell)

Crie um arquivo `setup.ps1`:

```powershell
# setup.ps1 - Script de setup automático

Write-Host "🚀 Iniciando setup do projeto..." -ForegroundColor Green

# 1. Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js não encontrado. Instale em https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Instalar dependências
Write-Host "`n📦 Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas" -ForegroundColor Green

# 3. Criar .env.local se não existir
if (-not (Test-Path ".env.local")) {
    Write-Host "`n📝 Criando .env.local..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Arquivo .env.local criado" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edite .env.local com suas credenciais!" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ .env.local já existe" -ForegroundColor Green
}

# 4. Verificar build
Write-Host "`n🔨 Testando build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build OK" -ForegroundColor Green

# 5. Conclusão
Write-Host "`n🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "`n📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Edite .env.local com suas credenciais do Supabase" -ForegroundColor White
Write-Host "2. Execute: npm run dev" -ForegroundColor White
Write-Host "3. Acesse: http://localhost:3000" -ForegroundColor White
Write-Host "`n📚 Documentação: Ver README.md" -ForegroundColor Cyan
```

**Usar:**
```powershell
.\setup.ps1
```

---

### Script de Limpeza

Crie um arquivo `clean.ps1`:

```powershell
# clean.ps1 - Limpa caches e builds

Write-Host "🧹 Limpando projeto..." -ForegroundColor Yellow

# Limpar node_modules
if (Test-Path "node_modules") {
    Write-Host "Removendo node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force node_modules
}

# Limpar .next
if (Test-Path ".next") {
    Write-Host "Removendo .next..." -ForegroundColor Gray
    Remove-Item -Recurse -Force .next
}

# Limpar package-lock.json
if (Test-Path "package-lock.json") {
    Write-Host "Removendo package-lock.json..." -ForegroundColor Gray
    Remove-Item package-lock.json
}

Write-Host "✅ Projeto limpo!" -ForegroundColor Green
Write-Host "Execute 'npm install' para reinstalar" -ForegroundColor Cyan
```

**Usar:**
```powershell
.\clean.ps1
npm install
```

---

### Script de Backup

Crie um arquivo `backup.ps1`:

```powershell
# backup.ps1 - Faz backup do banco de dados

Write-Host "💾 Iniciando backup..." -ForegroundColor Yellow

$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFile = "backup_$date.sql"

Write-Host "Exportando banco de dados..." -ForegroundColor Gray

# Você precisará ajustar isso com suas credenciais
# Ou usar o Supabase Dashboard para exportar

Write-Host "✅ Backup salvo em: $backupFile" -ForegroundColor Green
```

---

### Script de Deploy

Crie um arquivo `deploy.ps1`:

```powershell
# deploy.ps1 - Deploy automatizado

Write-Host "🚀 Iniciando deploy..." -ForegroundColor Green

# 1. Verificar mudanças
Write-Host "`n📊 Verificando mudanças..." -ForegroundColor Yellow
git status

$continue = Read-Host "`nContinuar com deploy? (S/N)"
if ($continue -ne "S") {
    Write-Host "❌ Deploy cancelado" -ForegroundColor Red
    exit 0
}

# 2. Testar build
Write-Host "`n🔨 Testando build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falhou. Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

# 3. Commit e push
Write-Host "`n📤 Fazendo commit e push..." -ForegroundColor Yellow
git add .
$message = Read-Host "Mensagem do commit"
git commit -m "$message"
git push origin main

Write-Host "`n✅ Deploy iniciado!" -ForegroundColor Green
Write-Host "Acompanhe em: https://vercel.com/dashboard" -ForegroundColor Cyan
```

**Usar:**
```powershell
.\deploy.ps1
```

---

## 📊 Comandos de Monitoramento

### Verificar Tamanhos
```powershell
# Tamanho do node_modules
(Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# Tamanho do build
(Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

# Tamanho total do projeto
(Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

### Verificar Dependências
```powershell
# Ver dependências desatualizadas
npm outdated

# Ver árvore de dependências
npm list --depth=0

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

### Logs e Debug
```powershell
# Ver logs do Vercel
vercel logs

# Ver logs locais
npm run dev 2>&1 | Tee-Object -FilePath "dev.log"

# Limpar console
Clear-Host
```

---

## 🎯 Atalhos Úteis

### Adicione ao seu profile.ps1

```powershell
# Atalhos para o projeto
function barcode-dev { npm run dev }
function barcode-build { npm run build }
function barcode-deploy { .\deploy.ps1 }
function barcode-clean { .\clean.ps1 }

# Aliases Git
function gs { git status }
function ga { git add . }
function gc { param($msg) git commit -m $msg }
function gp { git push origin main }
```

**Adicionar ao profile:**
```powershell
notepad $PROFILE
# Cole os atalhos acima
# Salve e feche
# Reabra o PowerShell
```

---

## 🔍 Comandos de Análise

### Bundle Size
```powershell
# Analisar tamanho do bundle
npm run build
# Ver relatório em .next/analyze/
```

### Performance
```powershell
# Lighthouse CI (requer Chrome)
npm install -g @lhci/cli
lhci autorun --url=http://localhost:3000
```

### Código
```powershell
# Contar linhas de código
(Get-ChildItem src -Recurse -Include *.ts,*.tsx | Select-String . -CaseSensitive).Count

# Complexidade (requer ferramenta)
npm install -g complexity-report
cr src/**/*.ts
```

---

## 📝 Comandos de Documentação

### Gerar Docs
```powershell
# TypeDoc (se configurado)
npm install -g typedoc
typedoc --out docs src

# JSDoc
npm install -g jsdoc
jsdoc -r src -d docs
```

### Markdown Preview
```powershell
# No VS Code
code README.md
# Pressione Ctrl+Shift+V para preview
```

---

## 🧪 Comandos de Teste (quando implementar)

```powershell
# Rodar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E
npm run test:e2e

# Rodar específico
npm test -- BarcodeForm.test.ts

# Watch mode
npm test -- --watch
```

---

## 🐳 Docker (Opcional)

### Criar Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Comandos Docker
```powershell
# Build
docker build -t barcode-generator .

# Run
docker run -p 3000:3000 barcode-generator

# Docker Compose
docker-compose up
```

---

## ⚡ Comandos Rápidos

```powershell
# Setup completo
npm install && copy .env.example .env.local && npm run dev

# Limpar e reinstalar
Remove-Item -Recurse -Force node_modules,.next,package-lock.json; npm install

# Build e deploy
npm run build && git add . && git commit -m "Deploy" && git push

# Ver status completo
git status && npm outdated && npm audit
```

---

## 💡 Dicas

### Alias no package.json

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf node_modules .next package-lock.json",
    "fresh": "npm run clean && npm install",
    "deploy": "npm run build && git push",
    "logs": "vercel logs"
  }
}
```

### PowerShell Profile

Carregar automaticamente ao abrir terminal:

```powershell
# Adicionar ao $PROFILE
Set-Location "C:\Work\microsaas\barCodeGen"
Write-Host "📦 Projeto Barcode Generator carregado!" -ForegroundColor Green
```

---

**Salve estes scripts para agilizar seu workflow!** 🚀

💡 Personalize os scripts conforme suas necessidades.
