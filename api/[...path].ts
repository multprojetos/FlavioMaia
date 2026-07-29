import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Supabase Client
// ---------------------------------------------------------------------------
const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_KEY || '').trim();

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseServiceKey);

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function verifyToken(authHeader: string | undefined): any | null {
  try {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main Handler (catch-all for /api/*)
// ---------------------------------------------------------------------------
export default async function handler(req: any, res: any) {
  setCors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse the path: req.url will be something like /api/auth/login or /api/properties/123
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';

  try {
    // =========================================================================
    // AUTH ROUTES
    // =========================================================================

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { username, password } = req.body || {};

      if (!isSupabaseConfigured()) {
        // Dev mode fallback
        if (username === 'admin' && password === 'admin123') {
          const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).json({
            token,
            user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
          });
        }
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Supabase lookup
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.status(200).json({
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
      });
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && method === 'GET') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token inválido' });
      return res.status(200).json({ user: decoded });
    }

    // =========================================================================
    // PUBLIC PROPERTIES
    // =========================================================================

    // GET /api/properties  (list available)
    if (pathname === '/api/properties' && method === 'GET') {
      if (!isSupabaseConfigured()) {
        return res.status(200).json([]);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // GET /api/properties/:id
    const publicPropertyMatch = pathname.match(/^\/api\/properties\/([^/]+)$/);
    if (publicPropertyMatch && method === 'GET') {
      const id = publicPropertyMatch[1];

      if (!isSupabaseConfigured()) {
        return res.status(404).json({ error: 'Imóvel não encontrado' });
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

      return res.status(200).json(data);
    }

    // =========================================================================
    // ADMIN PROPERTIES (all require auth)
    // =========================================================================

    // GET /api/admin/properties
    if (pathname === '/api/admin/properties' && method === 'GET') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(200).json([]);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // POST /api/admin/properties
    if (pathname === '/api/admin/properties' && method === 'POST') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const property = req.body;
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
          images: property.images,
          featured: property.featured || false,
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT /api/admin/properties/:id
    const adminPropertyUpdateMatch = pathname.match(/^\/api\/admin\/properties\/([^/]+)$/);
    if (adminPropertyUpdateMatch && method === 'PUT') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const id = adminPropertyUpdateMatch[1];
      const property = req.body;

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
          images: property.images,
          featured: property.featured,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE /api/admin/properties/:id
    const adminPropertyDeleteMatch = pathname.match(/^\/api\/admin\/properties\/([^/]+)$/);
    if (adminPropertyDeleteMatch && method === 'DELETE') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const id = adminPropertyDeleteMatch[1];
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    // PATCH /api/admin/properties/:id/status
    const adminStatusMatch = pathname.match(/^\/api\/admin\/properties\/([^/]+)\/status$/);
    if (adminStatusMatch && method === 'PATCH') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const id = adminStatusMatch[1];
      const { status } = req.body;

      const { data, error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // =========================================================================
    // 404 - Route not found
    // =========================================================================
    return res.status(404).json({ error: 'Rota não encontrada' });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
