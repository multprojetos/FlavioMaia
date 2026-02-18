# 🎯 Guia Completo do Painel Administrativo

## 📦 Instalação

### 1. Instalar Dependências

```bash
npm install
```

Novas dependências adicionadas:
- `@supabase/supabase-js` - Cliente Supabase
- `bcryptjs` - Criptografia de senhas
- `jsonwebtoken` - Autenticação JWT

### 2. Configurar Supabase

Siga o guia completo em `SUPABASE_SETUP.md`:

1. Criar projeto no Supabase
2. Executar script SQL para criar tabelas
3. Copiar credenciais
4. Criar arquivo `.env` (use `.env.example` como modelo)

### 3. Rodar o Projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔐 Acesso ao Painel

### URL de Acesso
```
http://localhost:3000/admin/login
```

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro acesso!

## 📱 Funcionalidades

### 1. Dashboard (`/admin/dashboard`)

Visão geral com:
- Total de imóveis cadastrados
- Imóveis disponíveis (visíveis no site)
- Imóveis alugados (ocultos)
- Imóveis vendidos (ocultos)
- Últimos imóveis cadastrados
- Ações rápidas

### 2. Gerenciar Imóveis (`/admin/imoveis`)

**Listagem:**
- Visualizar todos os imóveis
- Buscar por título ou endereço
- Filtrar por status (Disponível/Alugado/Vendido)
- Filtrar por tipo (Apartamento/Casa/Comercial)
- Mudar status rapidamente
- Editar ou excluir imóveis

**Status dos Imóveis:**
- 🟢 **Disponível**: Visível no site público
- 🔵 **Alugado**: Oculto do site (mas mantém no banco)
- 🟣 **Vendido**: Oculto do site (mas mantém no banco)

### 3. Adicionar Imóvel (`/admin/imoveis/novo`)

**Formulário completo com:**

#### Informações Básicas
- Título
- Descrição detalhada
- Tipo (Apartamento, Casa, Comercial)
- Operação (Aluguel ou Venda)
- Status (Disponível, Alugado, Vendido)
- Preço

#### Localização
- Cidade
- Bairro
- Endereço completo

#### Detalhes
- Número de quartos
- Número de banheiros
- Número de garagens
- Área em m²
- Características (lista personalizável)

#### Imagens
- Adicionar múltiplas imagens via URL
- Primeira imagem = capa
- Preview das imagens
- Remover imagens

#### Opções
- Marcar como destaque (aparece na home)

### 4. Editar Imóvel (`/admin/imoveis/:id/editar`)

- Mesmo formulário de adicionar
- Pré-preenchido com dados atuais
- Possibilidade de alterar tudo

## 🖼️ Gerenciamento de Imagens

### Opções para Hospedar Imagens

#### 1. Unsplash (Temporário)
```
https://images.unsplash.com/photo-XXXXX?w=800
```
- ✅ Gratuito
- ✅ Fotos profissionais
- ❌ Não são fotos reais do imóvel

#### 2. Imgur (Teste)
1. Acesse https://imgur.com
2. Faça upload da foto
3. Copie a URL direta da imagem
4. Cole no campo de imagens

#### 3. Cloudinary (Recomendado)
1. Crie conta em https://cloudinary.com
2. Configure as variáveis de ambiente
3. Faça upload via painel
4. Use a URL pública

#### 4. Supabase Storage (Integrado)
1. Crie bucket `property-images` no Supabase
2. Configure como público
3. Implemente upload direto (código já preparado)

## 🔄 Fluxo de Trabalho

### Cadastrar Novo Imóvel

1. Acesse `/admin/imoveis`
2. Clique em "Novo Imóvel"
3. Preencha todos os campos obrigatórios (*)
4. Adicione pelo menos 1 imagem
5. Adicione características (use os botões rápidos)
6. Marque como destaque se necessário
7. Clique em "Cadastrar"
8. Imóvel aparece no site instantaneamente

### Marcar Imóvel como Alugado

**Opção 1 - Rápida:**
1. Na listagem, use o dropdown de status
2. Selecione "Alugado"
3. Imóvel some do site automaticamente

**Opção 2 - Completa:**
1. Clique em "Editar"
2. Mude o status para "Alugado"
3. Salve

### Reativar Imóvel

1. Filtre por "Alugado" ou "Vendido"
2. Mude o status para "Disponível"
3. Imóvel volta a aparecer no site

### Excluir Imóvel

1. Clique no ícone de lixeira
2. Confirme a exclusão
3. ⚠️ **Ação irreversível!**

## 🔒 Segurança

### Autenticação
- JWT com expiração de 7 dias
- Token armazenado no localStorage
- Middleware de autenticação em todas as rotas admin

### Autorização
- Apenas usuários autenticados acessam rotas `/api/admin/*`
- Rotas públicas (`/api/properties`) retornam apenas imóveis disponíveis

### Senhas
- Criptografadas com bcrypt (10 rounds)
- Nunca armazenadas em texto plano
- Nunca retornadas pela API

### Banco de Dados
- Row Level Security (RLS) habilitado
- Políticas de acesso configuradas
- Apenas admins podem modificar dados

## 🚀 Deploy

### Vercel (Recomendado)

1. **Configurar Variáveis de Ambiente:**
   - Vá em Settings → Environment Variables
   - Adicione todas as variáveis do `.env`

2. **Deploy:**
   ```bash
   git push origin master
   ```
   - Deploy automático

3. **Acessar Painel:**
   ```
   https://seu-site.vercel.app/admin/login
   ```

### Outras Plataformas

- **Netlify**: Suporta, mas requer configuração adicional
- **Railway**: Excelente para Node.js + PostgreSQL
- **Render**: Boa opção com free tier

## 📊 Monitoramento

### Logs
- Erros aparecem no console do servidor
- Use ferramentas como Sentry para produção

### Performance
- Dashboard do Supabase mostra métricas
- Monitore uso de storage para imagens

### Backup
- Supabase faz backup automático diário
- Exporte dados manualmente se necessário

## 🐛 Troubleshooting

### "Supabase não configurado"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o Supabase está rodando
- Em desenvolvimento, funciona com mock data

### "Token inválido"
- Faça logout e login novamente
- Limpe o localStorage
- Verifique se JWT_SECRET está configurado

### "Erro ao salvar imóvel"
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme que as URLs das imagens são válidas
- Veja os logs do servidor para detalhes

### Imagens não carregam
- Verifique se as URLs são públicas
- Teste a URL diretamente no navegador
- Use HTTPS, não HTTP

## 💡 Dicas

1. **Organize as Imagens**: Use nomes descritivos ao fazer upload
2. **Descrições Completas**: Quanto mais detalhes, melhor para SEO
3. **Características**: Use os botões rápidos para padronizar
4. **Destaque**: Limite a 6 imóveis em destaque
5. **Backup**: Exporte dados periodicamente
6. **Fotos de Qualidade**: Use imagens com boa iluminação e resolução

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este guia
2. Veja `SUPABASE_SETUP.md` para configuração do banco
3. Veja `FAQ_TECNICO.md` para perguntas comuns

## 🎓 Treinamento do Cliente

### Vídeo Tutorial (Sugestão)
1. Login no painel
2. Visão geral do dashboard
3. Como adicionar um imóvel
4. Como editar e mudar status
5. Como adicionar fotos
6. Como marcar como alugado/vendido

### Documentação para Cliente
Crie um PDF simplificado com:
- Como fazer login
- Como adicionar imóvel (passo a passo com prints)
- Como marcar como alugado
- Onde conseguir fotos (Imgur)
- Contato para suporte

---

**Painel Admin Completo e Pronto para Uso! 🎉**
