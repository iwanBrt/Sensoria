import { getDb, isDbConfigured } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const configured = isDbConfigured();

  if (!configured) {
    return res.status(200).json({
      configured: false,
      connected: false,
      provider: 'Vercel Postgres (Neon)',
      message: 'Vercel Postgres belum terhubung. Tambahkan Postgres di Vercel Dashboard -> Storage.',
    });
  }

  try {
    const sql = getDb();
    const startTime = Date.now();
    await sql`SELECT 1;`;
    const latency = Date.now() - startTime;

    // Check counts
    const coursesCount = await sql`SELECT COUNT(*) FROM courses;`;
    const studentsCount = await sql`SELECT COUNT(*) FROM students;`;
    const materialsCount = await sql`SELECT COUNT(*) FROM materials;`;

    return res.status(200).json({
      configured: true,
      connected: true,
      provider: 'Vercel Postgres (Neon)',
      latencyMs: latency,
      totalCourses: Number(coursesCount[0]?.count || 0),
      totalStudents: Number(studentsCount[0]?.count || 0),
      totalMaterials: Number(materialsCount[0]?.count || 0),
    });
  } catch (err) {
    return res.status(200).json({
      configured: true,
      connected: false,
      provider: 'Vercel Postgres (Neon)',
      error: err.message,
    });
  }
}
