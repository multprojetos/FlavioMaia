# Flávio Maia Imóveis - Site Profissional

> 🚀 **[COMECE AQUI](START_HERE.md)** - Guia de início rápido em 15 minutos!

Site moderno e profissional desenvolvido para a Flávio Maia Imóveis de Carmo/RJ, com foco em experiência do usuário, performance e conversão.

## 📚 Documentação Completa

- **[START_HERE.md](START_HERE.md)** - 🔥 Comece por aqui! (15 min)
- **[INDEX.md](INDEX.md)** - Índice de toda documentação
- **[RESUMO_PROJETO.md](RESUMO_PROJETO.md)** - Resumo executivo
- **[PROPOSTA_COMERCIAL.md](PROPOSTA_COMERCIAL.md)** - Proposta para cliente
- **[GUIA_APRESENTACAO.md](GUIA_APRESENTACAO.md)** - Como apresentar
- **[SCRIPT_APRESENTACAO.md](SCRIPT_APRESENTACAO.md)** - Roteiro detalhado
- **[DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)** - Como fazer deploy
- **[FAQ_TECNICO.md](FAQ_TECNICO.md)** - Perguntas e respostas
- **[CHECKLIST_COMPLETO.md](CHECKLIST_COMPLETO.md)** - Lista de verificação

## 🎯 Objetivo do Projeto

Este projeto foi criado como uma proposta de modernização do site atual da imobiliária, demonstrando:
- Design profissional e moderno
- Experiência de usuário superior
- Integração direta com WhatsApp
- Galeria de imagens profissional
- Sistema de busca e filtros avançados
- Responsividade total (mobile-first)
- Performance otimizada

## ✨ Funcionalidades Implementadas

### 1. **Dados Realistas**
- 15 imóveis baseados no portfólio real da imobiliária
- Informações completas: preço, localização, características
- Imagens profissionais de alta qualidade

### 2. **Integração WhatsApp**
- Botão de contato direto em cada imóvel
- Mensagem pré-formatada com informações do imóvel
- Facilita a conversão de visitantes em leads

### 3. **Galeria de Imagens Profissional**
- Lightbox com navegação por teclado
- Thumbnails para navegação rápida
- Zoom e visualização em tela cheia
- Contador de imagens

### 4. **Sistema de Busca Avançado**
- Filtros por tipo de imóvel (casa, apartamento, terreno, comercial)
- Filtro por operação (venda ou aluguel)
- Filtro por cidade e bairro
- Filtro por preço mínimo
- Filtro por número de quartos
- Filtro por área mínima

### 5. **Design Moderno**
- Interface limpa e profissional
- Tema claro/escuro
- Animações suaves
- Componentes UI modernos (shadcn/ui)
- Tipografia elegante

### 6. **Funcionalidades Adicionais**
- Sistema de favoritos
- Compartilhamento de imóveis
- Cards de imóveis com informações destacadas
- Página de detalhes completa
- Seção de depoimentos
- Informações da equipe

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework JavaScript moderno
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI profissionais
- **Wouter** - Roteamento leve
- **Lucide React** - Ícones modernos
- **Express** - Backend Node.js

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou pnpm

### Passos

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd FlavioMaia
```

2. Instale as dependências:
```bash
# Se tiver pnpm instalado (recomendado)
pnpm install

# Ou com npm (use --legacy-peer-deps se necessário)
npm install --legacy-peer-deps
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 📱 Contatos da Imobiliária

- **Telefone:** (22) 2537-1394
- **WhatsApp:** (22) 98812-9414
- **Email:** contato@flaviomaia.com.br
- **Endereço:** Carmo - RJ

## 🎨 Diferenciais em Relação ao Site Atual

### Site Atual (flaviomaia.com.br)
❌ Design desatualado
❌ Falta de imagens dos imóveis
❌ Informações incompletas
❌ Navegação confusa
❌ Sem busca avançada
❌ Não responsivo adequadamente
❌ Sem integração direta com WhatsApp

### Este Projeto
✅ Design moderno e profissional
✅ Galeria de imagens completa
✅ Informações detalhadas de cada imóvel
✅ Navegação intuitiva
✅ Sistema de busca e filtros avançados
✅ 100% responsivo (mobile-first)
✅ Integração WhatsApp em um clique
✅ Performance otimizada
✅ SEO-friendly
✅ Compartilhamento de imóveis
✅ Sistema de favoritos

## 📊 Estrutura do Projeto

```
FlavioMaia/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── ui/       # Componentes UI (shadcn)
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   └── ...
│   │   ├── pages/        # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Properties.tsx
│   │   │   ├── PropertyDetail.tsx
│   │   │   └── ...
│   │   ├── contexts/     # Contextos React
│   │   └── hooks/        # Custom hooks
│   └── public/           # Arquivos estáticos
├── server/               # Backend Express
├── shared/               # Código compartilhado
│   ├── types.ts         # Tipos TypeScript
│   ├── mockData.ts      # Dados dos imóveis
│   └── const.ts
└── README.md
```

## 🎯 Próximos Passos Sugeridos

1. **Deploy em Produção**
   - Hospedar em Vercel/Netlify (gratuito)
   - Configurar domínio personalizado

2. **Integração com Backend Real**
   - API para gerenciar imóveis
   - Painel administrativo
   - Upload de imagens

3. **Funcionalidades Adicionais**
   - Sistema de agendamento de visitas
   - Chat ao vivo
   - Calculadora de financiamento
   - Comparador de imóveis
   - Tour virtual 360°
   - Integração com Google Maps

4. **SEO e Marketing**
   - Otimização para mecanismos de busca
   - Google Analytics
   - Facebook Pixel
   - Blog de conteúdo

## 💼 Proposta de Valor

Este projeto demonstra como um site profissional pode:
- **Aumentar a credibilidade** da imobiliária
- **Melhorar a experiência** dos clientes
- **Facilitar o contato** e conversão
- **Destacar-se da concorrência**
- **Profissionalizar a presença online**

## 📄 Licença

MIT

## 👨‍💻 Desenvolvedor

Projeto desenvolvido como proposta de modernização para Flávio Maia Imóveis.

---

**Nota:** Este é um projeto de demonstração com dados mockados baseados nos imóveis reais da imobiliária. Para uso em produção, seria necessário integrar com um backend real e sistema de gerenciamento de conteúdo.
