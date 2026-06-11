// جلب عبر بروكسي سريع لتجاوز بطء الاتصال المباشر
async function serpFetch(url) {
  try {
    const proxy1 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    const res1 = await fetch(proxy1);
    if (res1.ok) {
      const text = await res1.text();
      if (text.trim().startsWith('{')) return JSON.parse(text);
    }
  } catch (_) {}
  try {
    const proxy2 = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res2 = await fetch(proxy2);
    const data2 = await res2.json();
    if (data2.contents && data2.contents.trim().startsWith('{')) return JSON.parse(data2.contents);
  } catch (_) {}
  // محاولة أخيرة: اتصال مباشر
  const direct = await fetch(url);
  return await direct.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'query مطلوب' });

  const SERP_KEY = process.env.SERP_API_KEY;
  if (!SERP_KEY) return res.status(500).json({ error: 'المفتاح غير مضبوط في الخادم' });

  try {
    // الخطوة 1: ابحث عن المكان
    const searchUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&hl=ar&gl=sa&api_key=${SERP_KEY}`;
    const searchData = await serpFetch(searchUrl);

    const place = searchData.place_results || (searchData.local_results && searchData.local_results[0]);
    if (!place) return res.status(200).json({ reviews: [], message: 'لم يتم العثور على المكان' });

    const dataId = place.data_id;

    // الخطوة 2: اجلب التقييمات
    let reviews = [];
    if (dataId) {
      const reviewsUrl = `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(dataId)}&hl=ar&api_key=${SERP_KEY}`;
      const reviewsData = await serpFetch(reviewsUrl);
      reviews = reviewsData?.reviews || [];
    }
    if (reviews.length === 0 && place.user_reviews?.most_relevant) {
      reviews = place.user_reviews.most_relevant;
    }

    // صفّي الإيجابية (4 نجوم فأعلى) وخذ أفضل 5
    const positive = reviews
      .filter(r => (r.rating || r.stars || 0) >= 4 && (r.snippet || r.description || r.text))
      .slice(0, 5)
      .map(r => ({
        author: r.user?.name || r.username || 'ضيف',
        text: r.snippet || r.description || r.text || '',
        rating: r.rating || r.stars || 5,
      }));

    return res.status(200).json({
      reviews: positive,
      place_name: place.title,
    });

  } catch (err) {
    return res.status(500).json({ error: 'خطأ في جلب التقييمات: ' + err.message });
  }
}
