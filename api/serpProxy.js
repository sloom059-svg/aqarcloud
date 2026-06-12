// بروكسي خاص لأداة مولّد المواقع — يمرر طلبات SerpAPI بدون مشاكل CORS
// يُستدعى: /api/serpProxy?url=<رابط serpapi كامل مشفر>
export default async function handler(req, res) {
  // السماح بالاستدعاء من أي مصدر (الأداة ملف HTML محلي)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'missing url' });

  // أمان: نسمح فقط بروابط serpapi.com
  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: 'invalid url' });
  }
  if (target.hostname !== 'serpapi.com') {
    return res.status(403).json({ error: 'only serpapi.com allowed' });
  }

  try {
    const upstream = await fetch(target.toString());
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'proxy error: ' + err.message });
  }
}
