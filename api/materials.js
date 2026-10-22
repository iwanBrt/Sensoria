import { getDb, isDbConfigured } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!isDbConfigured()) {
    return res.status(503).json({ error: 'Vercel Postgres not configured yet' });
  }

  const sql = getDb();

  try {
    if (req.method === 'GET') {
      const materials = await sql`SELECT * FROM materials ORDER BY name ASC;`;
      return res.status(200).json(materials);
    }

    if (req.method === 'POST') {
      const item = req.body;
      if (!item || !item.id || !item.name) {
        return res.status(400).json({ error: 'Data bahan tidak lengkap' });
      }

      await sql`
        INSERT INTO materials (id, name, unit, cost, category)
        VALUES (
          ${item.id},
          ${item.name},
          ${item.unit || 'kg'},
          ${Number(item.cost || 0)},
          ${item.category || 'Umum'}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          unit = EXCLUDED.unit,
          cost = EXCLUDED.cost,
          category = EXCLUDED.category;
      `;

      return res.status(200).json({ success: true, data: item });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID bahan wajib diisi' });
      }

      await sql`DELETE FROM materials WHERE id = ${id};`;
      return res.status(200).json({ success: true, message: `Bahan ${id} berhasil dihapus` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in api/materials:', error);
    return res.status(500).json({ error: error.message });
  }
}
