// Helper API terpusat untuk undangan.
// Dengan Vite proxy, request ke /api/* diteruskan ke http://localhost:8080.
// Set VITE_API_URL di file .env untuk override saat production (mis. URL hosting).
export const API_BASE =
  (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');

function withFallback(urls) {
  return urls.filter(Boolean);
}

async function fetchJSON(urls, fallback = null) {
  for (const url of withFallback(urls)) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      return data;
    } catch {
      // coba URL berikutnya
    }
  }
  return fallback;
}

export function resolveImage(src) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  // path relatif backend (uploads/...) -> prefix API_BASE
  if (src.startsWith('uploads/')) return `${API_BASE}/${src}`;
  return src; // path lokal /assets/... tetap apa adanya
}

export function fetchSettings(fallback = null) {
  return fetchJSON([`${API_BASE}/api/settings`], fallback);
}

export async function checkInviteeGuest(to) {
  if (!to) return null;
  return fetchJSON([`${API_BASE}/api/invitees/check?to=${encodeURIComponent(to)}`], null);
}

export function fetchGallery(fallback) {
  return fetchJSON([`${API_BASE}/api/gallery`], fallback);
}

export function fetchStories(fallback) {
  return fetchJSON([`${API_BASE}/api/stories`], fallback);
}

export function fetchCouple(fallback) {
  return fetchJSON([`${API_BASE}/api/couple`], fallback);
}

export function fetchEvents(fallback = null) {
  return fetchJSON([`${API_BASE}/api/events`], fallback);
}

export function rsvpEndpoints() {
  return [`${API_BASE}/api/rsvp`, `${API_BASE}/api_rsvp.php`];
}

export async function postRSVP(payload) {
  let lastErr = null;
  for (const url of rsvpEndpoints()) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { url, data };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Semua endpoint RSVP gagal');
}

export async function fetchWishes(fallback = []) {
  const data = await fetchJSON(rsvpEndpoints(), fallback);
  return Array.isArray(data) ? data : fallback;
}
