import React from 'react';

const GREEN = '#0f3d36';

const ICONS = {
  mosque: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 22h18M6 22V10M18 22V10M12 2L4 10h16L12 2z"/><path d="M9 22v-6h6v6"/>
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  clinic: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  hospital: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  supermarket: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  park: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M12 22V12"/><path d="M5 13h14l-7-11-7 11z"/><line x1="4" y1="22" x2="20" y2="22"/>
    </svg>
  ),
  pharmacy: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M12 9v6"/>
    </svg>
  ),
  mall: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><circle cx="12" cy="14" r="3"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

export default function NearbyPlacesList({ places }) {
  if (!places?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {places.map((place, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border text-center"
          style={{ background: '#f0f7f5', borderColor: '#ccddd7' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#fff' }}>
            {ICONS[place.type] || ICONS.default}
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: GREEN }}>{place.label}</p>
            <p className="text-xs text-muted-foreground font-medium">{place.distance_label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}