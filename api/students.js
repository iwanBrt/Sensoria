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
      const students = await sql`SELECT * FROM students ORDER BY created_at DESC;`;
      return res.status(200).json(students);
    }

    if (req.method === 'POST') {
      const student = req.body;
      if (!student || !student.id || !student.name) {
        return res.status(400).json({ error: 'Data siswa tidak lengkap' });
      }

      await sql`
        INSERT INTO students (id, name, sensory_profile, profile_label, school, progress_summary, last_active)
        VALUES (
          ${student.id},
          ${student.name},
          ${student.sensoryProfile || student.sensory_profile || 'netra'},
          ${student.profileLabel || student.profile_label || ''},
          ${student.school || ''},
          ${student.progressSummary || student.progress_summary || ''},
          ${student.lastActive || student.last_active || 'Baru saja'}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          sensory_profile = EXCLUDED.sensory_profile,
          profile_label = EXCLUDED.profile_label,
          school = EXCLUDED.school,
          progress_summary = EXCLUDED.progress_summary,
          last_active = EXCLUDED.last_active;
      `;

      return res.status(200).json({ success: true, data: student });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID siswa wajib diisi' });
      }

      await sql`DELETE FROM students WHERE id = ${id};`;
      return res.status(200).json({ success: true, message: `Siswa ${id} berhasil dihapus` });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in api/students:', error);
    return res.status(500).json({ error: error.message });
  }
}
