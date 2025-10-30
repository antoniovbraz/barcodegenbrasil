# 📦 Instalação - Guia Completo

## 🎯 Visão Geral

Este guia explica como instalar e configurar o projeto localmente.

---

## 📋 Pré-requisitos

### 1. Node.js e NPM

**Verificar se já tem instalado:**
```powershell
node --version
npm --version
```

**Deve mostrar:**
```
v18.0.0 ou superior
8.0.0 ou superior
```

**Se não tiver, instalar:**

#### Windows:
1. Baixe em: https://nodejs.org/
2. Execute o instalador
3. Reinicie o terminal
4. Verifique novamente

#### Alternativa (Windows com Chocolatey):
```powershell
choco install nodejs
```

### 2. Git (Opcional, mas recomendado)

**Verificar:**
```powershell
git --version
```

**Instalar:**
- Windows: https://git-scm.com/download/win
- Ou: `choco install git`

### 3. Editor de Código (Recomendado)

- **Visual Studio Code**: https://code.visualstudio.com/
- Com extensões recomendadas (veja `.vscode/extensions.json`)

---

## 🚀 Instalação do Projeto

### Opção 1: Via Git (Recomendado)

```powershell
# 1. Clonar repositório
git clone https://github.com/seu-usuario/barcode-generator.git
cd barcode-generator

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
copy .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Rodar em desenvolvimento
npm run dev
```

### Opção 2: Download Manual

1. Baixe o ZIP do repositório
2. Extraia para uma pasta
3. Abra terminal na pasta
4. Execute:
   ```powershell
   npm install
   copy .env.example .env.local
   npm run dev
   ```

---

## 📦 Dependências Instaladas

### Produção (necessárias para rodar)

```json
{
  "@supabase/supabase-js": "^2.39.3",  // Cliente Supabase
  "bwip-js": "^4.1.1",                 // Gera códigos de barras
  "jspdf": "^2.5.1",                   // Cria PDFs
  "next": "14.1.0",                    // Framework Next.js
  "react": "^18.2.0",                  // React
  "react-dom": "^18.2.0",              // React DOM
  "date-fns": "^3.2.0"                 // Manipulação de datas
}
```

### Desenvolvimento (apenas para desenvolver)

```json
{
  "@types/node": "^20",                // Tipos Node.js
  "@types/react": "^18",               // Tipos React
  "@types/react-dom": "^18",           // Tipos React DOM
  "autoprefixer": "^10.0.1",           // CSS autoprefixer
  "eslint": "^8",                      // Linter JavaScript
  "eslint-config-next": "14.1.0",      // Config ESLint Next.js
  "postcss": "^8",                     // Processador CSS
  "tailwindcss": "^3.3.0",             // Framework CSS
  "typescript": "^5"                   // TypeScript
}
```

**Total instalado:** ~300MB

---

## ⚙️ Configuração de Ambiente

### 1. Criar arquivo .env.local

```powershell
copy .env.example .env.local
```

### 2. Preencher variáveis

Edite `.env.local`:

```env
# Obter em: https://supabase.com/dashboard
# Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3. Verificar configuração

```powershell
# Abrir arquivo para editar
notepad .env.local

# Ou no VS Code
code .env.local
```

---

## 🧪 Testar Instalação

### 1. Build local

```powershell
npm run build
```

**Deve mostrar:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### 2. Rodar em desenvolvimento

```powershell
npm run dev
```

**Deve mostrar:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
- ready in 2.3s
```

### 3. Acessar aplicação

1. Abra navegador
2. Acesse: http://localhost:3000
3. Deve carregar a interface

---

## 🔧 Scripts Disponíveis

```powershell
# Desenvolvimento (com hot reload)
npm run dev

# Build de produção
npm run build

# Rodar build de produção localmente
npm start

# Verificar erros de lint
npm run lint
```

---

## 🐛 Problemas Comuns na Instalação

### Erro: "ENOENT: no such file or directory"

**Causa:** Diretório node_modules corrompido

**Solução:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Erro: "gyp ERR! build error"

**Causa:** Ferramentas de build C++ não instaladas

**Solução Windows:**
```powershell
npm install --global windows-build-tools
```

### Erro: "EPERM: operation not permitted"

**Causa:** Permissões ou antivírus bloqueando

**Solução:**
```powershell
# Rodar PowerShell como Administrador
# Ou desativar temporariamente antivírus
```

### Erro: "Module not found"

**Causa:** Cache do Node desatualizado

**Solução:**
```powershell
npm cache clean --force
Remove-Item -Recurse -Force .next
npm install
npm run dev
```

### Erro: "Port 3000 already in use"

**Causa:** Porta 3000 já está sendo usada

**Solução:**
```powershell
# Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar outra porta
$env:PORT=3001; npm run dev
```

---

## 📚 Extensões VS Code Recomendadas

Instale para melhor experiência:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - Destaca erros de código

2. **Prettier** (`esbenp.prettier-vscode`)
   - Formata código automaticamente

3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete para classes CSS

4. **Supabase** (`supabase.supabase-vscode`)
   - Integração com Supabase

**Instalar todas de uma vez:**
```powershell
# VS Code irá sugerir instalar ao abrir o projeto
# Ou instalar manualmente via Command Palette (Ctrl+Shift+P)
# "Extensions: Show Recommended Extensions"
```

---

## 🔄 Atualizar Dependências

### Verificar atualizações disponíveis

```powershell
npm outdated
```

### Atualizar todas para versões compatíveis

```powershell
npm update
```

### Atualizar para versões mais recentes (cuidado!)

```powershell
npm install -g npm-check-updates
ncu -u
npm install
```

**⚠️ Aviso:** Teste após atualizar!

---

## 🧹 Limpeza e Manutenção

### Limpar cache

```powershell
# Cache do npm
npm cache clean --force

# Cache do Next.js
Remove-Item -Recurse -Force .next

# Todos os caches
Remove-Item -Recurse -Force node_modules, .next, package-lock.json
npm install
```

### Verificar tamanho da instalação

```powershell
# Ver tamanho de node_modules
du -sh node_modules

# Ou no Windows (PowerShell)
(Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

**Tamanho esperado:** ~300MB

---

## 📊 Estrutura Após Instalação

```
barCodeGen/
├── node_modules/          ← Dependências (300MB)
├── .next/                 ← Build cache (gerado)
├── src/                   ← Código fonte
├── public/                ← Arquivos estáticos
├── .env.local            ← Variáveis de ambiente (criar)
├── .gitignore            ← Arquivos ignorados
├── next.config.js        ← Config Next.js
├── package.json          ← Dependências
├── package-lock.json     ← Lock de versões
├── tsconfig.json         ← Config TypeScript
├── tailwind.config.ts    ← Config Tailwind
└── README.md             ← Documentação
```

---

## ✅ Checklist de Instalação

Marque cada etapa:

- [ ] Node.js 18+ instalado
- [ ] Git instalado (opcional)
- [ ] Projeto clonado/baixado
- [ ] `npm install` executado com sucesso
- [ ] `.env.local` criado e preenchido
- [ ] `npm run dev` funciona
- [ ] Aplicação abre em http://localhost:3000
- [ ] Consegue gerar um PDF de teste
- [ ] VS Code com extensões instalado (opcional)

---

## 🎓 Próximos Passos

Após instalação bem-sucedida:

1. ✅ **Ler** `README.md` para visão geral
2. 🧪 **Testar** gerando alguns códigos
3. 🎨 **Personalizar** conforme `CUSTOMIZATION.md`
4. 🚀 **Fazer deploy** seguindo `STEP-BY-STEP.md`

---

## 💡 Dicas

### Desenvolvimento Produtivo

```powershell
# Terminal 1: Rodar aplicação
npm run dev

# Terminal 2: Rodar testes (se implementar)
npm test -- --watch

# Terminal 3: Livre para comandos git, etc
```

### Hot Reload

- Salve arquivo → Browser atualiza automaticamente
- Não precisa reiniciar `npm run dev`
- Apenas reinicie se mudar `.env.local`

### Debug

```javascript
// Adicione console.logs no código
console.log('Debug:', variavel);

// Abra DevTools do browser (F12)
// Vá na aba Console
```

---

## 📞 Precisa de Ajuda?

- 📖 Leia `TROUBLESHOOTING.md`
- 🔍 Procure erro no Google
- 💬 Veja issues no GitHub
- 📧 Entre em contato com equipe

---

## 🎉 Instalação Completa!

Você está pronto para desenvolver! 🚀

**Comandos essenciais:**
```powershell
npm run dev      # Desenvolver
npm run build    # Testar build
npm run lint     # Verificar código
```

**Arquivos importantes:**
- `src/app/page.tsx` - Página principal
- `src/components/BarcodeForm.tsx` - Formulário
- `src/app/api/generate/route.ts` - API de geração

**Happy coding!** 💻✨
