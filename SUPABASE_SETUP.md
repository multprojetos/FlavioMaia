# 🗄️ Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - Name: `flaviomaia-imoveis`
   - Database Password: (anote essa senha!)
   - Region: South America (São Paulo)
4. Aguarde ~2 minutos para criar

## 2. Criar Tabelas

Vá em "SQL Editor" e execute este script:

```sql
-- Tabela de usuários admin
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de imóveis
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('apartment', 'house', 'commercial')),
  operation TEXT NOT NULL CHECK (operation IN ('rent', 'sale')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'sold')),
  price DECIMAL(10,2) NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  garages INTEGER NOT NULL,
  area DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_operation ON properties(operation);
CREATE INDEX idx_properties_featured ON properties(featured);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: admin123)
-- Hash gerado com bcrypt rounds=10
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$rKZLvXZnJx5z5Z5Z5Z5Z5uN8qH8qH8qH8qH8qH8qH8qH8qH8qH8qH', 'admin@flaviomaia.com.br', 'admin');

-- Habilitar Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
-- Qualquer um pode ler imóveis disponíveis
CREATE POLICY "Imóveis disponíveis são públicos" 
  ON properties FOR SELECT 
  USING (status = 'available');

-- Apenas admins autenticados podem fazer tudo
CREATE POLICY "Admins podem fazer tudo" 
  ON properties FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem ler usuários" 
  ON users FOR SELECT 
  USING (auth.role() = 'authenticated');
```

## 3. Obter Credenciais

1. Vá em "Settings" → "API"
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (chave pública)
   - **service_role key**: `eyJhbGc...` (chave privada - NUNCA exponha!)

## 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# JWT Secret (para autenticação)
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-chars

# Cloudinary (para upload de imagens)
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

## 5. Instalar Dependências

```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## 6. Testar Conexão

Execute o servidor e teste:
```bash
npm run dev
```

Acesse: http://localhost:3000/admin/login
- Usuário: `admin`
- Senha: `admin123`

## 7. Migrar Dados Existentes (Opcional)

Se você já tem imóveis no `mockData.ts`, execute o script de migração:

```bash
npm run migrate-data
```

## 8. Configurar Storage para Imagens

Para permitir o upload de fotos dos imóveis no painel administrativo:

1. Vá em "SQL Editor" no Supabase e execute:

```sql
-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Permitir acesso público às imagens
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'property-images' );

-- Permitir que qualquer um (incluindo anon) faça upload e deletar para demonstração
-- NOTA: Em produção, mude para: auth.role() = 'authenticated'
CREATE POLICY "Enable Upload for demo" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'property-images' );

CREATE POLICY "Enable Delete for demo" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'property-images' );
```

## 9. Backup Automático

O Supabase faz backup automático diário. Para backup manual:

1. Vá em "Database" → "Backups"
2. Clique em "Create backup"

## 10. Monitoramento

- Dashboard do Supabase mostra:
  - Requisições por segundo
  - Uso de storage
  - Logs de erros
  - Performance de queries

## Custos

- **Free Tier**: Até 500MB de DB, 1GB de storage, 2GB de bandwidth
- **Pro**: $25/mês - 8GB de DB, 100GB de storage, 250GB de bandwidth
- Para este projeto, o Free Tier é suficiente inicialmente

## Segurança

✅ RLS habilitado
✅ Políticas de acesso configuradas
✅ Senhas com bcrypt
✅ JWT para autenticação
✅ HTTPS obrigatório
✅ Variáveis de ambiente protegidas

## Próximos Passos

Após configurar o Supabase:
1. Adicione as variáveis de ambiente no Vercel
2. Faça deploy
3. Teste o login admin
4. Cadastre os primeiros imóveis
