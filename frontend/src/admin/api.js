// Helper API terpusat untuk Admin Panel
// Dengan Vite proxy, request ke /api/* diteruskan ke http://localhost:8080
// sehingga tidak ada CORS issue.
export const API_BASE = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');

export function getToken() {
  return localStorage.getItem('admin_token') || '';
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

export function clearToken() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function getUser() {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem('admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('admin_user');
  }
}

function authHeaders(isJson = true) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE}/${path.replace(/^\//, '')}`;

  let response;
  try {
    response = await fetch(url, options);
  } catch (networkErr) {
    console.error('Network error:', networkErr);
    throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:8080.');
  }

  if (response.status === 401) {
    clearToken();
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.messages?.error || response.statusText || 'Terjadi kesalahan pada server';
    throw new Error(errorMsg);
  }

  return data;
}

export function apiGet(path) {
  return apiRequest(path, {
    method: 'GET',
    headers: authHeaders(true),
  });
}

export function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });
}

export function apiPostForm(path, formData) {
  return apiRequest(path, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData,
  });
}

export function apiDelete(path) {
  return apiRequest(path, {
    method: 'DELETE',
    headers: authHeaders(true),
  });
}

// Auth API
export async function loginAdmin(username, password) {
  const res = await apiPost('/api/auth/login', { username, password });
  if (res?.token) {
    setToken(res.token);
    setUser(res.user);
  }
  return res;
}

export async function logoutAdmin() {
  try {
    await apiPost('/api/auth/logout', {});
  } finally {
    clearToken();
  }
}

export async function getMe() {
  return apiGet('/api/auth/me');
}

// Helpers
export function resolveAdminImage(src) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('uploads/')) return `${API_BASE}/${src}`;
  return src;
}

