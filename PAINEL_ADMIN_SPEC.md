# 🔐 Especificação do Painel Administrativo

## Funcionalidades

### 1. Autenticação
- Login com usuário e senha
- Sessão segura com JWT
- Logout
- Senha criptografada

### 2. Dashboard
- Total de imóveis cadastrados
- Imóveis disponíveis
- Imóveis alugados
- Imóveis vendidos
- Últimas atualizações

### 3. Gerenciamento de Imóveis

#### Listar Imóveis
- Tabela com todos os imóveis
- Filtros: Status, Tipo, Operação
- Busca por título/endereço
- Ações: Editar, Excluir, Mudar Status

#### Adicionar Imóvel
- Formulário completo com:
  - Título
  - Descrição
  - Tipo (Apartamento, Casa, Comercial)
  - Operação (Venda, Aluguel)
  - Preço
  - Localização (Cidade, Bairro, Endereço)
  - Detalhes (Quartos, Banheiros, Garagens, Área)
  - Características (múltipla escolha)
  - Upload de múltiplas fotos
  - Status (Disponível, Alugado, Vendido)
  - Destaque (sim/não)

#### Editar Imóvel
- Mesmo formulário de adicionar
- Pré-preenchido com dados atuais
- Possibilidade de adicionar/remover fotos

#### Mudar Status
- Botão rápido para mudar status
- Disponível → Alugado → Vendido
- Imóveis não disponíveis ficam ocultos no site

### 4. Upload de Imagens
- Drag & drop
- Preview antes de salvar
- Múltiplas imagens por imóvel
- Ordem das imagens (primeira = capa)
- Compressão automática

## Tecnologias

### Backend
- Node.js + Express
- PostgreSQL (banco de dados)
- Prisma ORM
- JWT para autenticação
- Multer para upload de arquivos
- Cloudinary para hospedar imagens

### Frontend Admin
- React + TypeScript
- React Hook Form
- TanStack Table
- Drag & drop para upload
- shadcn/ui components

## Estrutura de Dados

### Tabela: properties
```sql
id: UUID
title: String
description: Text
type: Enum (apartment, house, commercial)
operation: Enum (rent, sale)
status: Enum (available, rented, sold)
price: Decimal
city: String
neighborhood: String
address: String
bedrooms: Integer
bathrooms: Integer
garages: Integer
area: Decimal
features: JSON Array
images: JSON Array (URLs)
featured: Boolean
createdAt: DateTime
updatedAt: DateTime
```

### Tabela: users
```sql
id: UUID
username: String (unique)
password: String (hashed)
email: String
role: Enum (admin, editor)
createdAt: DateTime
```

## Rotas da API

### Autenticação
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Imóveis
- GET /api/properties (público - apenas disponíveis)
- GET /api/admin/properties (admin - todos)
- GET /api/admin/properties/:id
- POST /api/admin/properties
- PUT /api/admin/properties/:id
- DELETE /api/admin/properties/:id
- PATCH /api/admin/properties/:id/status

### Upload
- POST /api/admin/upload (múltiplas imagens)
- DELETE /api/admin/upload/:imageId

## Páginas do Admin

1. `/admin/login` - Página de login
2. `/admin/dashboard` - Dashboard com estatísticas
3. `/admin/imoveis` - Lista de imóveis
4. `/admin/imoveis/novo` - Adicionar imóvel
5. `/admin/imoveis/:id/editar` - Editar imóvel

## Segurança

- Senhas com bcrypt
- JWT com expiração
- Middleware de autenticação
- Validação de dados (Zod)
- Rate limiting
- CORS configurado
- Sanitização de inputs

## Estimativa de Desenvolvimento

- Setup inicial: 2h
- Autenticação: 3h
- CRUD de imóveis: 4h
- Upload de imagens: 3h
- Interface admin: 6h
- Testes e ajustes: 2h

**Total: ~20 horas de desenvolvimento**

## Custo Adicional Sugerido

Conforme `PROPOSTA_COMERCIAL.md`:
- Desenvolvimento: +R$ 3.200 (sobre o valor inicial)
- Manutenção: +R$ 120/mês (sobre o valor mensal)
- Hospedagem BD: ~R$ 50/mês (Supabase ou Railway)

**Total Plano Premium:**
- Inicial: R$ 7.400
- Mensal: R$ 400
