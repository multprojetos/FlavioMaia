# Guia de Deploy - Como Colocar o Site no Ar

## 🎯 Objetivo

Colocar o site no ar gratuitamente para demonstração ao cliente.

## 🚀 Opção 1: Vercel (Recomendado)

### Vantagens:
- ✅ Totalmente gratuito
- ✅ Deploy automático
- ✅ HTTPS incluído
- ✅ Performance excelente
- ✅ Fácil de usar

### Passo a Passo:

1. **Criar conta no Vercel**
   - Acesse: https://vercel.com
   - Clique em "Sign Up"
   - Use sua conta do GitHub

2. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Fazer Login**
   ```bash
   vercel login
   ```

4. **Deploy do Projeto**
   ```bash
   # Na pasta do projeto
   vercel
   ```

5. **Seguir as instruções:**
   - Set up and deploy? **Y**
   - Which scope? **Sua conta**
   - Link to existing project? **N**
   - What's your project's name? **flaviomaia-imoveis**
   - In which directory is your code located? **./**
   - Want to override the settings? **N**

6. **Aguardar o deploy**
   - O Vercel vai gerar uma URL tipo: `flaviomaia-imoveis.vercel.app`
   - Acesse e teste!

### Deploy de Atualizações:
```bash
# Sempre que fizer mudanças
vercel --prod
```

## 🌐 Opção 2: Netlify

### Vantagens:
- ✅ Gratuito
- ✅ Interface visual
- ✅ Fácil configuração
- ✅ Drag and drop

### Passo a Passo:

1. **Criar conta no Netlify**
   - Acesse: https://netlify.com
   - Clique em "Sign Up"

2. **Build do Projeto**
   ```bash
   npm run build
   ```

3. **Deploy via Interface**
   - Clique em "Add new site"
   - Escolha "Deploy manually"
   - Arraste a pasta `dist` para o Netlify
   - Aguarde o deploy

4. **Configurar domínio**
   - Clique em "Domain settings"
   - Customize o nome: `flaviomaia-imoveis.netlify.app`

## 📱 Opção 3: GitHub Pages

### Vantagens:
- ✅ Gratuito
- ✅ Integrado com GitHub
- ✅ Simples

### Passo a Passo:

1. **Criar repositório no GitHub**
   - Acesse: https://github.com
   - Clique em "New repository"
   - Nome: `flaviomaia-imoveis`

2. **Subir o código**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/flaviomaia-imoveis.git
   git push -u origin main
   ```

3. **Configurar GitHub Pages**
   - No repositório, vá em "Settings"
   - Clique em "Pages"
   - Source: "GitHub Actions"
   - Criar arquivo `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy

   on:
     push:
       branches: [main]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

4. **Aguardar deploy**
   - URL: `https://SEU-USUARIO.github.io/flaviomaia-imoveis`

## 🔧 Configurações Importantes

### 1. Variáveis de Ambiente

Se precisar de variáveis de ambiente, crie arquivo `.env`:

```env
VITE_WHATSAPP_NUMBER=5522988129414
VITE_PHONE_NUMBER=552225371394
VITE_EMAIL=contato@flaviomaia.com.br
```

### 2. Configurar no Vercel/Netlify

No painel de configurações, adicione as variáveis de ambiente.

### 3. Build Settings

**Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`

## 📝 Checklist Pré-Deploy

Antes de fazer o deploy, verifique:

- [ ] Todas as imagens carregam corretamente
- [ ] Links do WhatsApp funcionam
- [ ] Telefones estão corretos
- [ ] Emails estão corretos
- [ ] Site funciona em mobile
- [ ] Não há erros no console
- [ ] Todas as páginas funcionam
- [ ] Busca e filtros funcionam
- [ ] Galeria de imagens funciona

## 🧪 Testar o Deploy

Após o deploy, teste:

1. **Funcionalidades Básicas**
   - [ ] Página inicial carrega
   - [ ] Navegação entre páginas
   - [ ] Busca de imóveis
   - [ ] Filtros funcionam
   - [ ] Detalhes do imóvel

2. **Integrações**
   - [ ] Botão WhatsApp abre corretamente
   - [ ] Telefone liga corretamente
   - [ ] Compartilhamento funciona

3. **Responsividade**
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1920px)

4. **Performance**
   - [ ] Carrega em menos de 3 segundos
   - [ ] Imagens otimizadas
   - [ ] Sem erros no console

## 🎨 Personalizar Domínio (Opcional)

### Vercel:

1. Comprar domínio (ex: flaviomaiaimoveis.com.br)
2. No Vercel, ir em "Domains"
3. Adicionar domínio personalizado
4. Configurar DNS conforme instruções

### Netlify:

1. Comprar domínio
2. No Netlify, ir em "Domain settings"
3. Adicionar domínio personalizado
4. Configurar DNS

## 📊 Monitoramento

### Google Analytics (Opcional)

1. Criar conta no Google Analytics
2. Obter código de rastreamento
3. Adicionar no `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Troubleshooting

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Build failed"
```bash
# Verificar se build funciona localmente
npm run build

# Se funcionar, problema é no deploy
# Verificar logs do Vercel/Netlify
```

### Erro: "Page not found" em rotas
- Adicionar arquivo `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

- Ou `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📱 Compartilhar com Cliente

Após deploy bem-sucedido:

1. **Criar QR Code**
   - Use: https://www.qr-code-generator.com/
   - Cole a URL do site
   - Baixe o QR Code

2. **Preparar Apresentação**
   - Salvar URL em local fácil
   - Testar em diferentes dispositivos
   - Preparar screenshots

3. **Email para Cliente**
   ```
   Assunto: Protótipo do Novo Site - Flávio Maia Imóveis

   Olá, Sr. Flávio!

   O protótipo do novo site está pronto e no ar!

   🌐 Acesse: https://flaviomaia-imoveis.vercel.app

   Você pode testar em qualquer dispositivo:
   - Computador
   - Celular
   - Tablet

   Fique à vontade para explorar todas as funcionalidades.

   Aguardo seu feedback!

   Abraço,
   [Seu nome]
   ```

## 🎯 Próximos Passos

Após aprovação do cliente:

1. **Domínio Próprio**
   - Registrar domínio personalizado
   - Configurar DNS
   - Ativar HTTPS

2. **Backend Real**
   - Implementar API
   - Banco de dados
   - Painel administrativo

3. **Otimizações**
   - SEO avançado
   - Google Analytics
   - Facebook Pixel
   - Otimização de imagens

4. **Manutenção**
   - Backups automáticos
   - Monitoramento
   - Atualizações de segurança

## ✅ Checklist Final

- [ ] Site deployado e funcionando
- [ ] URL acessível
- [ ] Testado em múltiplos dispositivos
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] QR Code criado
- [ ] Screenshots preparados
- [ ] Email enviado ao cliente

---

**Pronto! Seu site está no ar e pronto para impressionar o cliente! 🚀**
