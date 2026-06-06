export const PLACE_ICONS = {
  mosque: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 2 7 5 7 8v1H5v2h1v9h12v-9h1V9h-2V8c0-3-2-6-5-6z"/>
      <path d="M9 20v-5a3 3 0 0 1 6 0v5"/>
      <circle cx="12" cy="2" r="0" fill="currentColor"/>
      <path d="M12 2v0M10 5c0-1.1.9-2 2-2s2 .9 2 2"/>
      <line x1="5" y1="11" x2="19" y2="11"/>
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M4 21V8l8-5 8 5v13"/>
      <rect x="9" y="14" width="6" height="7"/>
      <rect x="9" y="10" width="2" height="2"/>
      <rect x="13" y="10" width="2" height="2"/>
      <path d="M12 3v5"/>
    </svg>
  ),
  clinic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="15" rx="2"/>
      <path d="M3 10h18"/>
      <path d="M9 3v4M15 3v4"/>
      <path d="M12 13v4M10 15h4"/>
    </svg>
  ),
  hospital: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  supermarket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  park: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 6 5 10c0 3 2 5.5 5 6.5V21h4v-4.5c3-1 5-3.5 5-6.5 0-4-3-8-7-8z"/>
      <line x1="12" y1="21" x2="12" y2="16"/>
    </svg>
  ),
  pharmacy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14l-2-5"/>
      <circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>
      <path d="M10 9h4M12 7v4"/>
    </svg>
  ),
  mall: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M4 21V8l8-5 8 5v13"/>
      <path d="M9 21v-6h6v6"/>
      <rect x="9" y="10" width="6" height="4" rx="1"/>
      <line x1="12" y1="4" x2="12" y2="8"/>
    </svg>
  ),
};

export const PLACE_COLORS = {
  mosque:      { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  school:      { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  clinic:      { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  hospital:    { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  supermarket: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
  park:        { bg: '#dcfce7', color: '#14532d', border: '#bbf7d0' },
  pharmacy:    { bg: '#ede9fe', color: '#4c1d95', border: '#ddd6fe' },
  mall:        { bg: '#e0f2fe', color: '#0c4a6e', border: '#bae6fd' },
};