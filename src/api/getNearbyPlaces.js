const PLACE_TYPES = [
  { query: 'مسجد',           type: 'mosque',      label: 'مسجد'       },
  { query: 'مدرسة',          type: 'school',      label: 'مدرسة'      },
  { query: 'مستوصف عيادة',   type: 'clinic',      label: 'مستوصف'     },
  { query: 'سوبرماركت',      type: 'supermarket', label: 'سوبرماركت'  },
  { query: 'حديقة عامة',     type: 'park',        label: 'حديقة'      },
  { query: 'صيدلية',         type: 'pharmacy',    label: 'صيدلية'     },
  { query: 'مول مركز تجاري', type: 'mall',        label: 'مركز تجاري' },
];

function parseGoogleMapsUrl(url) {
  let match;
  match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  match = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  return null;
}

function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function formatDistance(meters) {
  if (meters < 100) return 'أمامه مباشرة';
  if (meters < 1000) return `${Math.round(meters / 50) * 50} متر`;
  return `${(meters / 1000).toFixed(1)} كم`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { maps_url, radius = 1500 } = req.body;
  if (!maps_url) return res.status(400).json({ error: 'maps_url مطلوب' });

  let coords = parseGoogleMapsUrl(maps_url);

  if (!coords) {
    try {
      const r = await fetch(`https://unshorten.me/json/${encodeURIComponent(maps_url)}`);
      const d = await r.json();
      if (d?.resolved_url) coords = parseGoogleMapsUrl(d.resolved_url);
    } catch (_) {}
  }

  if (!coords) {
    return res.status(400).json({ error: 'لم يتم التعرف على الإحداثيات. جرب الرابط الكامل من قوقل ماب' });
  }

  const { lat, lng } = coords;
  const SERP_KEY = process.env.SERP_API_KEY;
  const results = [];

  for (const pt of PLACE_TYPES) {
    const params = new URLSearchParams({
      engine: 'google_maps',
      q: pt.query,
      ll: `@${lat},${lng},15z`,
      type: 'search',
      hl: 'ar',
      api_key: SERP_KEY,
    });

    const r = await fetch(`https://serpapi.com/search?${params}`);
    const data = await r.json();
    if (!data.local_results?.length) continue;

    let nearest = null, nearestDist = Infinity;
    for (const place of data.local_results) {
      if (!place.gps_coordinates) continue;
      const d = calcDistance(lat, lng, place.gps_coordinates.latitude, place.gps_coordinates.longitude);
      if (d < nearestDist && d <= radius) { nearestDist = d; nearest = place; }
    }
    if (!nearest) continue;

    results.push({
      type: pt.type,
      label: pt.label,
      name: nearest.title,
      distance: Math.round(nearestDist),
      distance_label: formatDistance(nearestDist),
    });
  }

  results.sort((a, b) => a.distance - b.distance);
  return res.status(200).json({ lat, lng, places: results });
}
