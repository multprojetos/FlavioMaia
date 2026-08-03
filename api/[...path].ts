import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Supabase Client Setup
// ---------------------------------------------------------------------------
const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseServiceKey);

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// ---------------------------------------------------------------------------
// Helper: Map flat DB columns to expected nested Property object format
// ---------------------------------------------------------------------------
function formatPropertyFromDb(row: any) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title || '',
    description: row.description || '',
    type: row.type || 'apartment',
    operation: row.operation || 'rent',
    status: row.status || 'available',
    price: Number(row.price || 0),
    location: {
      city: row.city || 'Carmo',
      neighborhood: row.neighborhood || '',
      address: row.address || '',
    },
    details: {
      bedrooms: Number(row.bedrooms || 0),
      bathrooms: Number(row.bathrooms || 0),
      garages: Number(row.garages || 0),
      area: Number(row.area || 0),
      features: Array.isArray(row.features) ? row.features : [],
    },
    images: Array.isArray(row.images) ? row.images : [],
    featured: Boolean(row.featured),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Helpers: CORS & Auth
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
// Main Handler (Serverless API Endpoint)
// ---------------------------------------------------------------------------
export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        if (username === 'admin' && password === 'admin123') {
          const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).json({
            token,
            user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
          });
        }
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Check default admin fallback
      if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
          token,
          user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
        });
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

      const validPassword = await bcrypt.compare(password, user.password).catch(() => false);
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

      if (error) {
        console.error('Supabase error fetching properties:', error);
        return res.status(200).json([]);
      }

      const formatted = (data || []).map(formatPropertyFromDb);
      return res.status(200).json(formatted);
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

      return res.status(200).json(formatPropertyFromDb(data));
    }

    // =========================================================================
    // ADMIN PROPERTIES
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

      if (error) {
        console.error('Supabase error fetching admin properties:', error);
        return res.status(200).json([]);
      }

      const formatted = (data || []).map(formatPropertyFromDb);
      return res.status(200).json(formatted);
    }

    // GET /api/admin/properties/:id
    const adminPropertyGetMatch = pathname.match(/^\/api\/admin\/properties\/([^/]+)$/);
    if (adminPropertyGetMatch && method === 'GET') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      const id = adminPropertyGetMatch[1];
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return res.status(404).json({ error: 'Imóvel não encontrado' });
      return res.status(200).json(formatPropertyFromDb(data));
    }

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

    // POST /api/admin/properties
    if (pathname === '/api/admin/properties' && method === 'POST') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      if (!isSupabaseConfigured()) {
        return res.status(501).json({ error: 'Supabase não configurado' });
      }

      const property = req.body || {};
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
          city: property.location?.city || 'Carmo',
          neighborhood: property.location?.neighborhood || '',
          address: property.location?.address || '',
          bedrooms: property.details?.bedrooms || 0,
          bathrooms: property.details?.bathrooms || 0,
          garages: property.details?.garages || 0,
          area: property.details?.area || 0,
          features: property.details?.features || [],
          images: processedImages,
          featured: property.featured || false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error inserting property:', error);
        return res.status(500).json({ error: `Erro no Supabase: ${error.message}` });
      }

      return res.status(201).json(formatPropertyFromDb(data));
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
      const property = req.body || {};
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

      if (error) {
        console.error('Supabase error updating property:', error);
        return res.status(500).json({ error: `Erro no Supabase: ${error.message}` });
      }

      return res.status(200).json(formatPropertyFromDb(data));
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
      const { status } = req.body || {};

      const { data, error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(formatPropertyFromDb(data));
    }

    return res.status(404).json({ error: 'Rota não encontrada' });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
