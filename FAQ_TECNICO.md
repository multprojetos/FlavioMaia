# FAQ Técnico - Perguntas e Respostas

## 🔧 Instalação e Configuração

### P: Como instalo as dependências?

**R:** Use npm com a flag `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

Ou se tiver pnpm instalado:
```bash
pnpm install
```

### P: Por que preciso usar `--legacy-peer-deps`?

**R:** Há um conflito de versão entre o Vite 7 e o plugin `@builder.io/vite-plugin-jsx-loc` que espera Vite 4 ou 5. A flag resolve isso temporariamente. Em produção, você pode remover o plugin se não for necessário.

### P: Como rodo o projeto localmente?

**R:**
```bash
npm run dev
```

O site abrirá em `http://localhost:5173`

### P: Como faço o build para produção?

**R:**
```bash
npm run build
```

Os arquivos compilados ficarão na pasta `dist/`

---

## 🌐 Deploy e Hospedagem

### P: Qual a melhor plataforma para deploy?

**R:** Recomendo Vercel por ser:
- Gratuita
- Fácil de usar
- Rápida
- Com HTTPS automático
- Integração com Git

### P: Como faço deploy no Vercel?

**R:**
1. Instale o Vercel CLI: `npm install -g vercel`
2. Faça login: `vercel login`
3. Na pasta do projeto: `vercel`
4. Siga as instruções

Detalhes completos em `DEPLOY_GUIDE.md`

### P: Preciso de servidor próprio?

**R:** Não! O site é estático (frontend only) e pode ser hospedado gratuitamente em:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### P: E o backend Express que está no projeto?

**R:** O backend Express é opcional e só seria necessário se você implementar funcionalidades como:
- Formulário de contato com envio de email
- Sistema de gerenciamento de imóveis
- API própria

Para a versão de demonstração, não é necessário.

---

## 📱 Funcionalidades

### P: O WhatsApp funciona em desktop?

**R:** Sim! O link `wa.me` funciona tanto em mobile (abre o app) quanto em desktop (abre o WhatsApp Web).

### P: Como personalizo o número do WhatsApp?

**R:** Edite o arquivo `client/src/components/PropertyCard.tsx`:
```typescript
const phone = '5522988129414'; // Altere aqui
```

E também em `client/src/pages/PropertyDetail.tsx`:
```typescript
const phone = '5522988129414'; // Altere aqui
```

### P: Como adiciono mais imóveis?

**R:** Edite o arquivo `shared/mockData.ts` e adicione novos objetos no array `mockProperties`:
```typescript
{
  id: '16',
  title: 'Novo Imóvel',
  description: 'Descrição...',
  type: 'apartment',
  operation: 'rent',
  price: 1000,
  // ... resto das propriedades
}
```

### P: Como adiciono mais fotos aos imóveis?

**R:** No array `images` de cada imóvel em `mockData.ts`:
```typescript
images: [
  'https://url-da-imagem-1.jpg',
  'https://url-da-imagem-2.jpg',
  'https://url-da-imagem-3.jpg',
],
```

Recomendo usar:
- Unsplash (https://unsplash.com) - fotos gratuitas
- Pexels (https://pexels.com) - fotos gratuitas
- Ou fazer upload em serviços como Imgur, Cloudinary

---

## 🎨 Personalização

### P: Como mudo as cores do site?

**R:** As cores são definidas no Tailwind CSS. Edite `client/src/index.css`:
```css
:root {
  --primary: 220 70% 50%; /* Cor principal */
  --accent: 24 70% 50%;   /* Cor de destaque */
  /* ... outras cores */
}
```

### P: Como adiciono o logo da imobiliária?

**R:** 
1. Coloque o arquivo do logo em `client/public/`
2. Edite `client/src/components/Header.tsx`:
```tsx
<img src="/logo.png" alt="Flávio Maia Imóveis" className="h-10" />
```

### P: Como mudo os textos da página inicial?

**R:** Edite `client/src/pages/Home.tsx` e altere os textos diretamente no JSX.

### P: Como adiciono mais páginas?

**R:**
1. Crie arquivo em `client/src/pages/NovaPagina.tsx`
2. Adicione rota em `client/src/App.tsx`:
```tsx
<Route path="/nova-pagina" component={NovaPagina} />
```
3. Adicione link no Header

---

## 🐛 Problemas Comuns

### P: O site não carrega após deploy

**R:** Verifique:
1. Build foi bem-sucedido? `npm run build`
2. Configurações de roteamento (veja `DEPLOY_GUIDE.md`)
3. Console do navegador para erros
4. Logs da plataforma de deploy

### P: Imagens não aparecem

**R:** Verifique:
1. URLs das imagens estão corretas
2. URLs são HTTPS (não HTTP)
3. Imagens não foram removidas do servidor original
4. Console do navegador para erros de CORS

### P: WhatsApp não abre

**R:** Verifique:
1. Número está no formato correto: `55DDNNNNNNNNN`
2. Não tem espaços ou caracteres especiais
3. Mensagem está sendo codificada com `encodeURIComponent()`

### P: Filtros não funcionam

**R:** Verifique:
1. Dados dos imóveis estão corretos em `mockData.ts`
2. Tipos correspondem aos definidos em `types.ts`
3. Console do navegador para erros

### P: Site está lento

**R:** Otimize:
1. Comprima imagens (use TinyPNG ou similar)
2. Use URLs de CDN para imagens
3. Verifique tamanho das imagens (máximo 500KB cada)
4. Faça lazy loading de imagens

---

## 🔐 Segurança e Privacidade

### P: Os dados dos imóveis são seguros?

**R:** Atualmente os dados estão no código (mockData.ts). Para produção, recomendo:
1. Implementar backend com banco de dados
2. API com autenticação
3. Painel administrativo protegido

### P: Preciso de HTTPS?

**R:** Sim! Mas as plataformas de deploy (Vercel, Netlify) já incluem HTTPS automaticamente.

### P: Como protejo contra spam?

**R:** Se implementar formulários:
1. Use reCAPTCHA do Google
2. Implemente rate limiting
3. Valide dados no backend

---

## 📊 Analytics e SEO

### P: Como adiciono Google Analytics?

**R:** Veja instruções completas em `DEPLOY_GUIDE.md`, seção "Monitoramento".

### P: O site é otimizado para SEO?

**R:** Sim, básico:
- Estrutura HTML semântica
- Meta tags configuradas
- URLs amigáveis
- Performance otimizada

Para SEO avançado:
- Adicione meta descriptions personalizadas
- Implemente sitemap.xml
- Configure robots.txt
- Adicione Schema.org markup

### P: Como melhoro o SEO?

**R:**
1. Adicione meta tags únicas por página
2. Use títulos descritivos
3. Otimize imagens (alt text, tamanho)
4. Crie conteúdo de qualidade (blog)
5. Obtenha backlinks

---

## 💼 Comercial

### P: Posso usar este projeto para outros clientes?

**R:** Sim! O código é seu. Você pode:
- Reutilizar para outros clientes
- Modificar conforme necessário
- Vender como serviço
- Criar template

### P: Quanto devo cobrar?

**R:** Depende do mercado local, mas sugestões:
- Site básico: R$ 2.500 - R$ 4.000
- Site + manutenção: R$ 150 - R$ 300/mês
- Site + marketing: R$ 350 - R$ 600/mês

### P: Como justifico o preço?

**R:** Foque em:
- ROI (retorno do investimento)
- Aumento de conversão
- Profissionalismo
- Tempo economizado
- Vantagem competitiva

### P: E se o cliente pedir desconto?

**R:** Opções:
- Ofereça plano de pagamento
- Remova funcionalidades menos críticas
- Ofereça desconto por pagamento à vista
- Mantenha firme se o valor for justo

---

## 🚀 Próximos Passos

### P: Como adiciono painel administrativo?

**R:** Precisará:
1. Backend (Node.js + Express)
2. Banco de dados (PostgreSQL, MongoDB)
3. Autenticação (JWT)
4. Interface admin (React Admin, etc)

### P: Como adiciono sistema de login?

**R:** Implemente:
1. Backend com autenticação
2. JWT tokens
3. Rotas protegidas
4. Gerenciamento de sessão

### P: Como adiciono pagamento online?

**R:** Integre:
- Stripe
- PagSeguro
- Mercado Pago
- PayPal

### P: Como adiciono chat ao vivo?

**R:** Use serviços como:
- Tawk.to (gratuito)
- Intercom
- Drift
- Zendesk Chat

### P: Como adiciono tour virtual 360°?

**R:** Use:
- Matterport
- Kuula
- Google Street View
- Ou biblioteca Three.js para custom

---

## 📚 Recursos e Aprendizado

### P: Onde aprendo mais sobre React?

**R:**
- Documentação oficial: https://react.dev
- FreeCodeCamp
- Udemy (cursos pagos)
- YouTube (Traversy Media, Net Ninja)

### P: Onde aprendo mais sobre TypeScript?

**R:**
- Documentação oficial: https://www.typescriptlang.org
- TypeScript Handbook
- Execute Program
- Frontend Masters

### P: Onde aprendo mais sobre Tailwind CSS?

**R:**
- Documentação oficial: https://tailwindcss.com
- Tailwind UI (componentes pagos)
- YouTube tutorials
- Tailwind Play (playground online)

### P: Onde encontro componentes prontos?

**R:**
- shadcn/ui: https://ui.shadcn.com
- Headless UI: https://headlessui.com
- Radix UI: https://radix-ui.com
- Chakra UI: https://chakra-ui.com

---

## 🤝 Suporte

### P: Onde consigo ajuda se travar?

**R:**
- Stack Overflow
- GitHub Issues do projeto
- Discord de React/TypeScript
- Reddit (r/reactjs, r/typescript)
- Comunidades brasileiras (Dev.to, TabNews)

### P: Como reporto um bug?

**R:**
1. Verifique se já não foi reportado
2. Descreva o problema claramente
3. Inclua passos para reproduzir
4. Adicione screenshots se possível
5. Informe versões (Node, npm, etc)

### P: Como contribuo com melhorias?

**R:**
1. Fork o projeto
2. Crie branch para feature
3. Faça as mudanças
4. Teste bem
5. Abra Pull Request

---

## 💡 Dicas Profissionais

### P: Como me destaco da concorrência?

**R:**
- Entregue mais do que prometeu
- Comunique-se claramente
- Seja pontual
- Documente tudo
- Ofereça suporte excelente
- Peça feedback e testemunhos

### P: Como consigo mais clientes?

**R:**
- Portfolio online
- Presença em redes sociais
- Networking local
- Parcerias com agências
- Indicações de clientes satisfeitos
- Marketing de conteúdo (blog, YouTube)

### P: Como precificar meu trabalho?

**R:** Considere:
- Suas horas de trabalho
- Complexidade do projeto
- Valor entregue ao cliente
- Mercado local
- Sua experiência
- Custos (hospedagem, ferramentas)

Fórmula básica:
```
Preço = (Horas × Valor/Hora) + Custos + Margem
```

---

## 🎯 Conclusão

Tem mais dúvidas? 

- Revise a documentação completa
- Consulte os guias específicos
- Teste localmente antes de deploy
- Não tenha medo de experimentar

**Lembre-se:** Todo desenvolvedor começou do zero. Cada erro é uma oportunidade de aprendizado!

**Boa sorte com seu projeto! 🚀**
