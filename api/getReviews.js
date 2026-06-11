export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'query مطلوب' });

  const SERP_KEY = process.env.SERP_API_KEY;
  if (!SERP_KEY) return res.status(500).json({ error: 'SERP_API_KEY غير مضبوط في البيئة' });

  try {
    // الخطوة 1: ابحث عن المكان في Google Maps
    const searchParams = new URLSearchParams({
      engine: 'google_maps',
      q: query,
      hl: 'ar',
      type: 'search',
      api_key: SERP_KEY,
    });

    const searchRes = await fetch(`https://serpapi.com/search?${searchParams}`);
    const searchData = await searchRes.json();

    if (!searchData.local_results?.length) {
      return res.status(200).json({ reviews: [], message: 'لم يتم العثور على المكان في Google Maps' });
    }

    const place = searchData.local_results[0];
    // SerpAPI يستخدم data_id للتقييمات، مو place_id
    const dataId = place.data_id || place.place_id;

    if (!dataId) {
      return res.status(200).json({ reviews: [], message: 'لم يتم العثور على معرّف المكان' });
    }

    // الخطوة 2: جيب التقييمات بالـ data_id
    const reviewParams = new URLSearchParams({
      engine: 'google_maps_reviews',
      data_id: dataId,
      hl: 'ar',
      sort_by: 'ratingHigh',
      api_key: SERP_KEY,
    });

    const reviewRes = await fetch(`https://serpapi.com/search?${reviewParams}`);
    const reviewData = await reviewRes.json();

    const allReviews = reviewData.reviews || [];

    // صفّي التقييمات الإيجابية فقط (4 نجوم وأعلى)
    const positive = allReviews
      .filter(r => r.rating >= 4 && (r.snippet || r.text))
      .slice(0, 4)
      .map(r => ({
        author: r.user?.name || r.author_name || 'مجهول',
        text: r.snippet || r.text || '',
        rating: r.rating,
        date: r.date || r.relative_time_description || '',
        avatar: r.user?.thumbnail || r.profile_photo_url || null,
      }));

    return res.status(200).json({
      reviews: positive,
      place_name: place.title,
      total_rating: place.rating,
      total_reviews: place.reviews,
      _debug_data_id: dataId,
      _debug_raw_count: allReviews.length,
    });

  } catch (err) {
    console.error('SerpAPI error:', err);
    return res.status(500).json({ error: 'حدث خطأ في جلب التقييمات: ' + err.message });
  }
}
