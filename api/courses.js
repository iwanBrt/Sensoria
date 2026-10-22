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
    return res.status(503).json({
      error: 'Vercel Postgres not configured yet',
    });
  }

  const sql = getDb();

  try {
    if (req.method === 'GET') {
      const courses = await sql`SELECT * FROM courses ORDER BY created_at DESC;`;
      return res.status(200).json(courses);
    }

    if (req.method === 'POST') {
      const course = req.body;
      if (!course || !course.id || !course.title) {
        return res.status(400).json({ error: 'Data modul tidak lengkap' });
      }

      await sql`
        INSERT INTO courses (id, title, category, duration_text, default_modal, default_price, description, steps)
        VALUES (
          ${course.id},
          ${course.title},
          ${course.category || 'Kriya & Kerajinan'},
          ${course.durationText || course.duration_text || '4 Langkah'},
          ${Number(course.defaultModal || course.default_modal || 0)},
          ${Number(course.defaultPrice || course.default_price || 0)},
          ${course.description || ''},
          ${JSON.stringify(course.steps || [])}
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          duration_text = EXCLUDED.duration_text,
          default_modal = EXCLUDED.default_modal,
          default_price = EXCLUDED.default_price,
          description = EXCLUDED.description,
          steps = EXCLUDED.steps;
      `;

      return res.status(200).json({ success: true, data: course });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID modul wajib diisi' });
      }

      await sql`DELETE FROM courses WHERE id = ${id};`;
      return res.status(200).json({ success: true, message: `Modul ${id} berhasil dihapus` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in api/courses:', error);
    return res.status(500).json({ error: error.message });
  }
}
