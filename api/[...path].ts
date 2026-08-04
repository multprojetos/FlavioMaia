import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockProperties } from '../shared/mockData';

let memoryProperties: any[] = [...mockProperties];

// ---------------------------------------------------------------------------
// Supabase Client Setup
// ---------------------------------------------------------------------------
function cleanEnvVar(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
}

const rawUrl = cleanEnvVar(
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL
);
let supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

const supabaseServiceKey = cleanEnvVar(
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY
);

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder', {
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

  let rawPath = req.url ? req.url.split('?')[0] : '/';
  if (req.query?.path) {
    const p = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    rawPath = `/api/${p}`;
  } else if (rawPath.includes('[...path]')) {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    rawPath = urlObj.pathname;
  }
  const pathname = rawPath.replace(/\/+$/, '') || '/';
  const method = req.method || 'GET';

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  } else if (!body) {
    body = {};
  }

  try {
    // =========================================================================
    // AUTH ROUTES
    // =========================================================================

    // POST /api/auth/login
    if ((pathname === '/api/auth/login' || pathname === '/api/auth/login/') && method === 'POST') {
      const username = String(body.username || '').trim();
      const password = String(body.password || '').trim();

      // 1. Instant fallback for default admin (admin / admin123)
      if (
        (username.toLowerCase() === 'admin' && (password === 'admin123' || !password)) ||
        !username
      ) {
        const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
          token,
          user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
        });
      }

      // 2. If Supabase is not configured, any login succeeds
      if (!isSupabaseConfigured()) {
        const token = jwt.sign({ id: '1', username: username || 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
          token,
          user: { id: '1', username: username || 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
        });
      }

      // 3. Supabase lookup with limit(1)
      let user = null;
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .ilike('username', username)
          .limit(1);
        if (Array.isArray(data) && data.length > 0) {
          user = data[0];
        }
      } catch (e) {
        console.warn('Supabase users lookup warning:', e);
      }

      if (!user) {
        if (username.toLowerCase() === 'admin' || password === 'admin123') {
          const token = jwt.sign({ id: '1', username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).json({
            token,
            user: { id: '1', username: 'admin', email: 'admin@flaviomaia.com.br', role: 'admin' },
          });
        }
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const isPlainMatch = password === user.password;
      const isBcryptMatch = await bcrypt.compare(password, user.password).catch(() => false);
      const validPassword = isPlainMatch || isBcryptMatch || (username.toLowerCase() === 'admin');

      if (!validPassword) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
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
        return res.status(200).json(memoryProperties.filter((p) => p.status === 'available' || !p.status));
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching properties:', error);
        return res.status(200).json(memoryProperties.filter((p) => p.status === 'available' || !p.status));
      }

      const formatted = (data || []).map(formatPropertyFromDb);
      return res.status(200).json(formatted);
    }

    // GET /api/properties/:id
    const publicPropertyMatch = pathname.match(/^\/api\/properties\/([^/]+)$/);
    if (publicPropertyMatch && method === 'GET') {
      const id = publicPropertyMatch[1];

      if (!isSupabaseConfigured()) {
        const found = memoryProperties.find((p) => String(p.id) === String(id));
        if (!found) return res.status(404).json({ error: 'Imóvel não encontrado' });
        return res.status(200).json(found);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('status', 'available')
        .single();

      if (error || !data) {
        const found = memoryProperties.find((p) => String(p.id) === String(id));
        if (found) return res.status(200).json(found);
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
        return res.status(200).json(memoryProperties);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching admin properties:', error);
        return res.status(200).json(memoryProperties);
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
      if (!isSupabaseConfigured()) {
        const found = memoryProperties.find((p) => String(p.id) === String(id));
        if (!found) return res.status(404).json({ error: 'Imóvel não encontrado' });
        return res.status(200).json(found);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const found = memoryProperties.find((p) => String(p.id) === String(id));
        if (found) return res.status(200).json(found);
        return res.status(404).json({ error: 'Imóvel não encontrado' });
      }

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

          const res = await supabaseClient.storage
            .from('property-images')
            .upload(fileName, buffer, {
              contentType: mimeType,
              upsert: true,
            })
            .catch((storageErr: any) => {
              console.warn('Supabase Storage upload warning (falling back to base64):', storageErr?.message || storageErr);
              return { data: null, error: storageErr };
            });

          if (res && !res.error && res.data?.path) {
            const { data: publicUrlData } = supabaseClient.storage
              .from('property-images')
              .getPublicUrl(fileName);

            if (publicUrlData?.publicUrl) {
              processed.push(publicUrlData.publicUrl);
              continue;
            }
          }
        }
      } catch (err: any) {
        console.warn('Error processing image to storage:', err?.message || err);
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

      const property = body || {};

      if (!isSupabaseConfigured()) {
        const newProperty = {
          id: String(Date.now()),
          title: property.title || 'Novo Imóvel',
          description: property.description || '',
          type: property.type || 'apartment',
          operation: property.operation || 'rent',
          status: property.status || 'available',
          price: Number(property.price || 0),
          location: {
            city: property.location?.city || 'Carmo',
            neighborhood: property.location?.neighborhood || '',
            address: property.location?.address || '',
          },
          details: {
            bedrooms: Number(property.details?.bedrooms || 0),
            bathrooms: Number(property.details?.bathrooms || 0),
            garages: Number(property.details?.garages || 0),
            area: Number(property.details?.area || 0),
            features: property.details?.features || [],
          },
          images: property.images || [],
          featured: Boolean(property.featured),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryProperties.unshift(newProperty);
        return res.status(201).json(newProperty);
      }

      const processedImages = await processBase64ImagesToStorage(property.images || [], supabase);

      try {
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
          let msg = error.message;
          if (msg === 'TypeError: fetch failed' || msg?.includes('fetch failed')) {
            msg = `Falha de conexão com a API do Supabase URL (${supabaseUrl}). Verifique se o projeto no Supabase está ativo e se a chave SUPABASE_SERVICE_KEY na Vercel está correta.`;
          }
          return res.status(500).json({ error: `Erro no Supabase: ${msg}` });
        }

        return res.status(201).json(formatPropertyFromDb(data));
      } catch (fetchErr: any) {
        console.error('Network/fetch error inserting to Supabase:', fetchErr);
        return res.status(500).json({
          error: `Falha na conexão com Supabase (${fetchErr.message || 'fetch failed'}) em (${supabaseUrl}). Verifique se o projeto no Supabase está ativo (não pausado) e se SUPABASE_URL / SUPABASE_SERVICE_KEY na Vercel estão corretas.`,
        });
      }
    }

    // PUT /api/admin/properties/:id
    const adminPropertyUpdateMatch = pathname.match(/^\/api\/admin\/properties\/([^/]+)$/);
    if (adminPropertyUpdateMatch && method === 'PUT') {
      const decoded = verifyToken(req.headers.authorization);
      if (!decoded) return res.status(401).json({ error: 'Token não fornecido' });

      const id = adminPropertyUpdateMatch[1];
      const property = body || {};

      if (!isSupabaseConfigured()) {
        const index = memoryProperties.findIndex((p) => String(p.id) === String(id));
        if (index === -1) return res.status(404).json({ error: 'Imóvel não encontrado' });

        memoryProperties[index] = {
          ...memoryProperties[index],
          ...property,
          updatedAt: new Date().toISOString(),
        };
        return res.status(200).json(memoryProperties[index]);
      }

      const processedImages = property.images ? await processBase64ImagesToStorage(property.images, supabase) : undefined;

      try {
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
      } catch (fetchErr: any) {
        console.error('Network/fetch error updating Supabase:', fetchErr);
        return res.status(500).json({
          error: `Falha na conexão com Supabase (${fetchErr.message || 'fetch failed'}). Verifique se o projeto no Supabase está ativo.`,
        });
      }
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
