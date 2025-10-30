# ❓ Perguntas Frequentes (FAQ)

## 📋 Índice

- [Geral](#geral)
- [Instalação e Setup](#instalação-e-setup)
- [Uso](#uso)
- [Deploy](#deploy)
- [Problemas Técnicos](#problemas-técnicos)
- [Supabase](#supabase)
- [Custos](#custos)
- [Segurança](#segurança)
- [Personalização](#personalização)

---

## Geral

### O que é este projeto?

Uma aplicação web que converte códigos de barras sequenciais em PDFs prontos para impressão. Baseado em um script Python original, agora acessível via navegador.

### Por que criar uma versão web?

- ✅ Acesso de qualquer lugar
- ✅ Não precisa instalar Python
- ✅ Interface visual intuitiva
- ✅ Histórico persistente
- ✅ Compartilhável com equipe

### É grátis?

Sim! Para uso básico:
- Vercel: Gratuito até 100GB/mês
- Supabase: Gratuito até 500MB storage
- Para 90% dos usuários, os planos gratuitos são suficientes

### Posso usar comercialmente?

Sim! Licenciado sob MIT, permite uso comercial livre.

---

## Instalação e Setup

### Preciso saber programar?

Não para usar. Sim para modificar/personalizar.

### Quais são os requisitos mínimos?

**Para usar online:** Apenas um navegador moderno

**Para rodar localmente:**
- Node.js 18+
- 500MB espaço em disco
- 2GB RAM

### Quanto tempo leva a instalação?

- **Uso online:** 0 minutos (já está deployado)
- **Local:** 5 minutos
- **Deploy próprio:** 10-15 minutos

### Posso rodar sem internet?

Localmente sim, mas sem:
- Histórico (requer Supabase)
- Deploy automático

---

## Uso

### Como gero meu primeiro código de barras?

1. Acesse a aplicação
2. Preencha o formulário
3. Clique em "Gerar Códigos de Barras"
4. PDF baixa automaticamente

### Qual o formato da data?

Sempre **DD/MM/YYYY** (ex: 18/08/2025)

### Posso usar vírgula ou ponto no peso?

Ambos! "10", "10.5" ou "10,5" funcionam.

### Quantas etiquetas posso gerar?

Máximo de 1000 por vez no Vercel Hobby.

Para mais, use o script Python original ou faça upgrade.

### O PDF não está baixando, o que faço?

1. Verifique bloqueador de pop-ups
2. Tente outro navegador
3. Veja console (F12) para erros
4. Consulte TROUBLESHOOTING.md

### Posso salvar minhas configurações?

Sim! Use o histórico ou exporte para JSON (ver EXAMPLES.md)

### Como imprimo as etiquetas?

Abra o PDF e imprima normalmente. Configure:
- Tamanho: Real (100%)
- Orientação: Paisagem
- Papel: A4 ou específico de etiquetas

---

## Deploy

### Onde posso hospedar?

Recomendado: **Vercel** (gratuito e simples)

Alternativas: Netlify, Railway, Render

### Preciso de cartão de crédito?

Não para planos gratuitos do Vercel e Supabase.

### Quanto tempo demora o deploy?

- Primeiro deploy: ~5 minutos
- Deploys seguintes: ~2 minutos (automático)

### Como atualizo após deploy?

```bash
git add .
git commit -m "Atualização"
git push
```

Vercel detecta e faz deploy automático!

### Posso ter múltiplos ambientes?

Sim! Vercel cria automaticamente:
- Production (main branch)
- Preview (outras branches)

### Como desfaço um deploy?

No dashboard Vercel:
1. Deployments
2. Escolha deploy anterior
3. Promote to Production

---

## Problemas Técnicos

### Erro: "Cannot find module"

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Build falha no Vercel

1. Verifique variáveis de ambiente
2. Teste build local: `npm run build`
3. Veja logs do Vercel
4. Consulte TROUBLESHOOTING.md

### Código de barras não é legível

Aumente a qualidade em `src/app/api/generate/route.ts`:
```typescript
scale: 5,  // De 3 para 5
height: 20 // De 15 para 20
```

### Aplicação está lenta

- Reduza número de etiquetas
- Verifique conexão com Supabase
- Considere upgrade do plano Vercel

### "Port 3000 already in use"

```powershell
$env:PORT=3001; npm run dev
```

---

## Supabase

### Preciso usar Supabase?

Não! Funciona sem, mas sem histórico.

### Como crio uma conta?

1. Acesse supabase.com
2. Sign Up (gratuito)
3. Crie um projeto (2 minutos)

### Onde encontro as credenciais?

Settings → API → Copie:
- Project URL
- anon/public key
- service_role key

### O que é RLS?

Row Level Security - controla acesso aos dados.

Para desenvolvimento: permissivo
Para produção: restritivo por usuário

### Posso usar outro banco?

Sim! Adapte `src/lib/supabase.ts` para:
- PostgreSQL
- MySQL
- MongoDB
- Etc.

### Como faço backup?

Supabase Dashboard → Database → Backups

Ou exporte via SQL Editor.

---

## Custos

### É realmente grátis?

Sim para uso básico! Custos surgem apenas com alto volume.

### Quando preciso pagar?

**Vercel:** Se exceder 100GB bandwidth/mês

**Supabase:** Se exceder 500MB storage

### Quanto custa o upgrade?

- Vercel Pro: $20/mês
- Supabase Pro: $25/mês

Total: ~$45/mês (se precisar)

### Vale a pena o upgrade?

Depende do uso:
- <1000 PDFs/mês: Não precisa
- >5000 PDFs/mês: Considere

### Como monitoro uso?

- Vercel: Dashboard → Analytics
- Supabase: Dashboard → Settings → Usage

---

## Segurança

### Meus dados estão seguros?

Sim! 
- HTTPS por padrão
- Variáveis de ambiente protegidas
- Supabase com encriptação

### Quem pode acessar minha aplicação?

Qualquer pessoa com a URL.

Para restringir: implemente autenticação (ver CUSTOMIZATION.md)

### Como protejo minhas chaves?

- Nunca commite .env.local
- Use variáveis de ambiente no Vercel
- Service role key apenas no servidor

### Posso adicionar login?

Sim! Supabase Auth facilita (ver EXAMPLES.md)

### Como faço HTTPS?

Automático no Vercel!

---

## Personalização

### Posso mudar as cores?

Sim! Edite `tailwind.config.ts`

### Posso adicionar logo?

Sim! Modifique `src/app/api/generate/route.ts`

### Posso mudar tamanho das etiquetas?

Sim! Ajuste em `route.ts`:
```typescript
format: [100, 75] // [largura, altura] em mm
```

### Posso usar QR Code?

Sim! Substitua bwip-js por biblioteca de QR Code

Ver CUSTOMIZATION.md para detalhes

### Posso exportar Excel?

Ainda não implementado, mas possível!

Ver CUSTOMIZATION.md → "Exportar Outros Formatos"

---

## 🤔 Ainda tem dúvidas?

### Documentação Completa

- 📖 [README.md](README.md) - Visão geral
- ⚡ [QUICKSTART.md](QUICKSTART.md) - Início rápido
- 📦 [INSTALLATION.md](INSTALLATION.md) - Instalação
- 🚀 [STEP-BY-STEP.md](STEP-BY-STEP.md) - Deploy detalhado
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Resolver problemas
- 🎨 [CUSTOMIZATION.md](CUSTOMIZATION.md) - Personalizar
- 💻 [EXAMPLES.md](EXAMPLES.md) - Exemplos de código
- 📊 [COMPARISON.md](COMPARISON.md) - vs Python
- 🛠️ [COMMANDS.md](COMMANDS.md) - Comandos úteis

### Suporte

1. Consulte TROUBLESHOOTING.md
2. Busque no Google o erro específico
3. Veja issues no GitHub
4. Entre em contato com a equipe

### Contribuir

Encontrou um bug ou tem sugestão?

1. Abra uma issue no GitHub
2. Ou faça um Pull Request
3. Ajude a melhorar este FAQ!

---

## 📝 Glossário

**API:** Application Programming Interface - interface para comunicação

**Build:** Processo de compilar código para produção

**CLI:** Command Line Interface - interface de linha de comando

**Deploy:** Processo de publicar aplicação online

**Environment Variables:** Variáveis de configuração sensíveis

**Next.js:** Framework React para aplicações web

**Node.js:** Runtime JavaScript server-side

**PostgreSQL:** Banco de dados relacional (usado pelo Supabase)

**React:** Biblioteca JavaScript para UI

**Serverless:** Arquitetura sem servidor gerenciado

**SSR:** Server-Side Rendering - renderização no servidor

**Supabase:** Plataforma de banco de dados como serviço

**Tailwind CSS:** Framework CSS utility-first

**TypeScript:** JavaScript com tipagem estática

**Vercel:** Plataforma de hospedagem para frontend

---

## 🎯 Perguntas por Perfil

### Usuário Final
- Como uso a aplicação? → Ver QUICKSTART.md
- Quanto custa? → Grátis (uso básico)
- Preciso instalar algo? → Não (use online)

### Desenvolvedor
- Como instalo? → Ver INSTALLATION.md
- Como modifico? → Ver CUSTOMIZATION.md
- Como contribuo? → Abra PR no GitHub

### Gestor/Líder
- Vale a pena? → Ver COMPARISON.md
- Quanto custa? → Ver seção Custos acima
- É seguro? → Sim, ver seção Segurança

### DevOps/SysAdmin
- Como faço deploy? → Ver STEP-BY-STEP.md
- Como monitoro? → Vercel/Supabase dashboards
- Como escalo? → Upgrade planos ou self-host

---

**Não encontrou sua pergunta? Abra uma issue ou consulte a documentação completa!**

💡 Este FAQ é atualizado regularmente. Contribua com suas dúvidas!
