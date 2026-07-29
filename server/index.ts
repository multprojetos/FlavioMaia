import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from './supabase';
import { Property, LoginRequest } from '../shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Middleware de autenticação
const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============================================================================
  // API ROUTES
  // ============================================================================

  // AUTH - Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body as LoginRequest;

      if (!isSupabaseConfigured()) {
        // Modo desenvolvimento sem Supabase
        if (username === 'admin' && password === 'admin123') {
          const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({
            token,
            user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' }
          });
        }
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Buscar usuário no Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // AUTH - Verificar token
  app.get('/api/auth/me', authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  });

  // PROPERTIES - Listar públicos (apenas disponíveis)
  app.get('/api/properties', async (req, res) => {
    try {
      if (!isSupabaseConfigured()) {
        // Retornar mockData em desenvolvimento
        const { mockProperties } = await import('../shared/mockData');
        const available = mockProperties.filter(p => !p.status || p.status === 'available');
        return res.json(available);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }
  });

  // PROPERTIES - Listar todos (admin)
  app.get('/api/admin/properties', authMiddleware, async (req, res) => {
    try {
      if (!isSupabaseConfigured()) {
        const { mockProperties } = await import('../shared/mockData');
        return res.json(mockProperties);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      res.status(500).json({ error: 'Erro ao buscar imóveis' });
    }
  });

  // PROPERTIES - Buscar por ID
  app.get('/api/properties/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (!isSupabaseConfigured()) {
        const { mockProperties } = await import('../shared/mockData');
        const property = mockProperties.find(p => p.id === id);
        if (!property || (property.status && property.status !== 'available')) {
          return res.status(404).json({ error: 'Imóvel não encontrado' });
        }
        return res.json(property);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('status', 'available')
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Imóvel não encontrado' });
      }

      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar imóvel:', error);
      res.status(500).json({ error: 'Erro ao buscar imóvel' });
    }
  });

  // PROPERTIES - Criar (admin)
  app.post('/api/admin/properties', authMiddleware, async (req, res) => {
    try {
      const property = req.body as Property;

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado. Configure para usar esta funcionalidade.' });
      }

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: property.title,
          description: property.description,
          type: property.type,
          operation: property.operation,
          status: property.status || 'available',
          price: property.price,
          city: property.location.city,
          neighborhood: property.location.neighborhood,
          address: property.location.address,
          bedrooms: property.details.bedrooms,
          bathrooms: property.details.bathrooms,
          garages: property.details.garages,
          area: property.details.area,
          features: property.details.features,
          images: property.images,
          featured: property.featured || false,
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      res.status(500).json({ error: 'Erro ao criar imóvel' });
    }
  });

  // PROPERTIES - Atualizar (admin)
  app.put('/api/admin/properties/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const property = req.body as Property;

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const { data, error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          description: property.description,
          type: property.type,
          operation: property.operation,
          status: property.status,
          price: property.price,
          city: property.location.city,
          neighborhood: property.location.neighborhood,
          address: property.location.address,
          bedrooms: property.details.bedrooms,
          bathrooms: property.details.bathrooms,
          garages: property.details.garages,
          area: property.details.area,
          features: property.details.features,
          images: property.images,
          featured: property.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      res.status(500).json({ error: 'Erro ao atualizar imóvel' });
    }
  });

  // PROPERTIES - Atualizar status (admin)
  app.patch('/api/admin/properties/:id/status', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const { data, error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  });

  // PROPERTIES - Deletar (admin)
  app.delete('/api/admin/properties/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
      res.status(500).json({ error: 'Erro ao deletar imóvel' });
    }
  });

  // ============================================================================
  // STATIC FILES & CLIENT ROUTING
  // ============================================================================

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Supabase: ${isSupabaseConfigured() ? '✅ Configurado' : '⚠️  Não configurado (usando mock data)'}`);
  });
}

startServer().catch(console.error);
