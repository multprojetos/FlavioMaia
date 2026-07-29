# 🏠 Como Adicionar/Editar Imóveis no Site

## 📋 Visão Geral

Atualmente, os imóveis são gerenciados através do arquivo `shared/mockData.ts`. Este é o método mais simples e não requer banco de dados.

## ✏️ Método 1: Editar Diretamente o Arquivo (Atual)

### Passo a Passo para Adicionar um Novo Imóvel

1. **Abra o arquivo**: `shared/mockData.ts`

2. **Copie um imóvel existente** como modelo (exemplo do imóvel ID 1):

```typescript
{
  id: '16',  // ⚠️ IMPORTANTE: Sempre use um ID único e sequencial
  title: 'Apartamento 2 Quartos com Varanda',
  description: 'Descrição completa do imóvel com todos os detalhes importantes.',
  type: 'apartment',  // Opções: 'apartment', 'house', 'commercial'
  operation: 'rent',  // Opções: 'rent' (aluguel) ou 'sale' (venda)
  price: 850,  // Valor em reais (sem R$ ou pontos)
  location: { 
    city: 'Carmo', 
    neighborhood: 'Centro', 
    address: 'Rua Exemplo, 123 - Centro, Carmo - RJ' 
  },
  details: { 
    bedrooms: 2,      // Número de quartos
    bathrooms: 1,     // Número de banheiros
    garages: 1,       // Número de vagas de garagem
    area: 65,         // Área em m²
    features: ['Varanda', 'Área de Serviço', 'Portaria 24h']  // Características
  },
  images: [
    'https://images.unsplash.com/photo-XXXXX?w=800',  // URL da imagem principal
    'https://images.unsplash.com/photo-YYYYY?w=800',  // Imagem 2 (opcional)
    'https://images.unsplash.com/photo-ZZZZZ?w=800',  // Imagem 3 (opcional)
  ],
  featured: false,  // true = aparece em destaque na home, false = não
  createdAt: '2026-02-18',  // Data de cadastro (formato: YYYY-MM-DD)
  updatedAt: '2026-02-18',  // Data da última atualização
},
```

3. **Cole o novo imóvel** dentro do array `mockProperties`, antes do `];`

4. **Salve o arquivo** (Ctrl+S)

5. **Faça commit no Git**:
```bash
git add shared/mockData.ts
git commit -m "Adiciona novo imóvel: [Nome do Imóvel]"
git push
```

6. **Faça deploy** (se estiver usando Vercel, o deploy é automático após o push)

---

## 📸 Como Adicionar Fotos dos Imóveis

### Opção 1: Usar Unsplash (Temporário - Fotos Genéricas)
```
https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800
```
- Gratuito
- Fotos profissionais
- Mas não são as fotos reais do imóvel

### Opção 2: Hospedar no Imgur (Recomendado para Teste)
1. Acesse https://imgur.com
2. Faça upload da foto do imóvel
3. Clique com botão direito na imagem → "Copiar endereço da imagem"
4. Use a URL no campo `images`

### Opção 3: Cloudinary (Recomendado para Produção)
1. Crie conta gratuita em https://cloudinary.com
2. Faça upload das fotos
3. Copie a URL pública
4. Use no campo `images`

### Opção 4: Hospedar na Pasta do Projeto
1. Coloque as fotos em `client/public/imoveis/`
2. Use o caminho: `'/imoveis/foto-imovel-1.jpg'`
3. Faça commit das imagens junto com o código

---

## 🔄 Como Editar um Imóvel Existente

1. Abra `shared/mockData.ts`
2. Encontre o imóvel pelo `id` ou `title`
3. Edite os campos desejados
4. Salve, commit e push

**Exemplo - Marcar imóvel como alugado:**
```typescript
// Mude de:
operation: 'rent',

// Para:
operation: 'rented',  // Ou simplesmente remova o imóvel do array
```

---

## 🗑️ Como Remover um Imóvel

1. Abra `shared/mockData.ts`
2. Encontre o imóvel completo (de `{` até `},`)
3. Delete todo o bloco
4. Salve, commit e push

---

## 🎨 Campos Importantes

### `type` (Tipo do Imóvel)
- `'apartment'` - Apartamento
- `'house'` - Casa
- `'commercial'` - Comercial

### `operation` (Tipo de Operação)
- `'rent'` - Para alugar
- `'sale'` - Para vender

### `featured` (Destaque)
- `true` - Aparece na página inicial em "Imóveis em Destaque"
- `false` - Aparece apenas na página de listagem

### `features` (Características)
Exemplos de características comuns:
- 'Área de Serviço'
- 'Garagem'
- 'Piscina'
- 'Quintal'
- 'Varanda'
- 'Portaria 24h'
- 'Elevador'
- 'Mobiliado'
- 'Pet Friendly'
- 'Ar Condicionado'

---

## 🚀 Método 2: Painel Administrativo (Futuro)

Se o cliente contratar o plano com painel admin (R$ 7.400 inicial + R$ 400/mês), você desenvolverá:

### Funcionalidades do Painel:
- ✅ Login seguro
- ✅ Adicionar imóveis via formulário
- ✅ Upload de múltiplas fotos
- ✅ Editar/excluir imóveis
- ✅ Marcar como alugado/vendido
- ✅ Estatísticas de visualizações
- ✅ Gerenciar leads de contato

### Tecnologias Sugeridas:
- Backend: Node.js + Express + PostgreSQL
- Upload de imagens: Cloudinary ou AWS S3
- Autenticação: JWT
- Admin UI: React Admin ou criar custom

---

## 📊 Fluxo de Trabalho Recomendado

### Para Gestão Manual (Plano Básico - R$ 280/mês):
1. Cliente envia fotos e dados por WhatsApp
2. Você edita o arquivo `mockData.ts`
3. Faz commit e push
4. Deploy automático no Vercel (2-3 minutos)
5. Confirma com cliente que está online

### Para Gestão com Painel (Plano Premium - R$ 400/mês):
1. Cliente acessa painel admin
2. Faz login
3. Clica em "Adicionar Imóvel"
4. Preenche formulário e faz upload das fotos
5. Clica em "Publicar"
6. Imóvel aparece no site instantaneamente

---

## 🎯 Dicas Importantes

1. **IDs únicos**: Sempre use IDs sequenciais (16, 17, 18...)
2. **Fotos de qualidade**: Use fotos com boa iluminação e resolução
3. **Descrições completas**: Quanto mais detalhes, melhor
4. **Preços atualizados**: Revise os valores periodicamente
5. **Backup**: Sempre faça commit antes de editar

---

## 📞 Exemplo Prático Completo

```typescript
{
  id: '16',
  title: 'Casa 3 Quartos com Churrasqueira',
  description: 'Linda casa no Bairro Cohab com 3 quartos, sendo 1 suíte, sala ampla, cozinha planejada, 2 banheiros, área de serviço, garagem para 2 carros, churrasqueira e quintal. Acabamento de primeira qualidade, próximo a escolas e comércio.',
  type: 'house',
  operation: 'rent',
  price: 1400,
  location: { 
    city: 'Carmo', 
    neighborhood: 'Cohab', 
    address: 'Rua das Flores, 456 - Cohab, Carmo - RJ' 
  },
  details: { 
    bedrooms: 3, 
    bathrooms: 2, 
    garages: 2, 
    area: 150, 
    features: ['Suíte', 'Churrasqueira', 'Quintal', 'Cozinha Planejada', 'Garagem Dupla'] 
  },
  images: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  ],
  featured: true,
  createdAt: '2026-02-18',
  updatedAt: '2026-02-18',
},
```

---

## ❓ Dúvidas Frequentes

**P: Posso adicionar quantos imóveis quiser?**
R: Sim, não há limite.

**P: As fotos precisam estar em ordem específica?**
R: A primeira foto é a principal (aparece nos cards). As demais aparecem na galeria.

**P: Como marco um imóvel como alugado?**
R: Você pode remover do array ou criar um campo `status: 'rented'` (requer modificação no código).

**P: Preciso reiniciar o servidor após adicionar imóvel?**
R: Não, o Vite recarrega automaticamente em desenvolvimento. Em produção, basta fazer o deploy.

---

**Qualquer dúvida, consulte este guia ou entre em contato!** 🚀
