import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Simple query to verify connection
    const [rows] = await pool.query('SELECT 1 AS ok');
    return Response.json({ ok: true, result: rows[0] });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
