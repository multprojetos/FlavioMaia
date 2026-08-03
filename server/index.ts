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
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ============================================================================
  // API ROUTES
  // ============================================================================

  // AUTH - Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const username = String(req.body?.username || '').trim();
      const password = String(req.body?.password || '').trim();

      // Check default admin fallback (admin / admin123)
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
          token,
          user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' }
        });
      }

      if (!isSupabaseConfigured()) {
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

      // Verificar senha (suporta senha em texto plano e hash bcrypt)
      const isPlainMatch = password === user.password;
      const isBcryptMatch = await bcrypt.compare(password, user.password).catch(() => false);
      const validPassword = isPlainMatch || isBcryptMatch;

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

  async function processBase64ImagesToStorage(images: string[], supabaseClient: any): Promise<string[]> {
    if (!Array.isArray(images) || images.length === 0) return images;

    const processed: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (typeof img === 'string' && img.startsWith('data:image/')) {
        try {
          const matches = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const extension = mimeType.split('/')[1] || 'webp';
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `prop_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}.${extension}`;

            const { data, error } = await supabaseClient.storage
              .from('property-images')
              .upload(fileName, buffer, {
                contentType: mimeType,
                upsert: true,
              });

            if (!error && data?.path) {
              const { data: publicUrlData } = supabaseClient.storage
                .from('property-images')
                .getPublicUrl(fileName);

              if (publicUrlData?.publicUrl) {
                processed.push(publicUrlData.publicUrl);
                continue;
              }
            } else {
              console.warn('Supabase Storage upload warning (falling back to base64):', error?.message);
            }
          }
        } catch (err) {
          console.warn('Error processing image to storage:', err);
        }
      }
      processed.push(img);
    }

    return processed;
  }

  // PROPERTIES - Criar (admin)
  app.post('/api/admin/properties', authMiddleware, async (req, res) => {
    try {
      const property = req.body as Property;

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado. Configure para usar esta funcionalidade.' });
      }

      const processedImages = await processBase64ImagesToStorage(property.images || [], supabase);

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: property.title,
          description: property.description,
          type: property.type,
          operation: property.operation,
          status: property.status || 'available',
          price: property.price,
          city: property.location?.city,
          neighborhood: property.location?.neighborhood,
          address: property.location?.address,
          bedrooms: property.details?.bedrooms,
          bathrooms: property.details?.bathrooms,
          garages: property.details?.garages,
          area: property.details?.area,
          features: property.details?.features,
          images: processedImages,
          featured: property.featured || false,
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      console.error('Erro ao criar imóvel:', error);
      res.status(500).json({ error: error.message || 'Erro ao criar imóvel' });
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

      const processedImages = property.images ? await processBase64ImagesToStorage(property.images, supabase) : undefined;

      const { data, error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          description: property.description,
          type: property.type,
          operation: property.operation,
          status: property.status,
          price: property.price,
          city: property.location?.city,
          neighborhood: property.location?.neighborhood,
          address: property.location?.address,
          bedrooms: property.details?.bedrooms,
          bathrooms: property.details?.bathrooms,
          garages: property.details?.garages,
          area: property.details?.area,
          features: property.details?.features,
          images: processedImages,
          featured: property.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Erro ao atualizar imóvel:', error);
      res.status(500).json({ error: error.message || 'Erro ao atualizar imóvel' });
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
