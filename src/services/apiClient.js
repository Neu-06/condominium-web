import { getToken, clearAuth } from "./auth.js";

// SOLO usar variables de entorno, sin fallbacks estáticos
const API_BASE = import.meta.env.VITE_API_BASE;
const isDevelopment = import.meta.env.DEV;

// Verificar que la variable esté configurada
if (!API_BASE) {
  console.error('❌ VITE_API_BASE no está configurada en .env');
  console.error('📝 Crea un archivo .env con: VITE_API_BASE=tu-backend-url');
}

console.log('Entorno:', isDevelopment ? 'Desarrollo' : 'Producción');
console.log('API_BASE desde .env:', API_BASE);

export async function apiFetch(url, options = {}) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE no configurada. Revisa tu archivo .env');
  }

  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Siempre usar URL completa desde .env
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  console.log('Request a:', fullUrl);

  const res = await fetch(fullUrl, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    console.error('Error parsing JSON:', e);
  }

  if (res.status === 401) {
    clearAuth();
    if (!url.includes('/login')) window.location.href = '/login';
  }
  
  if (!res.ok) {
    throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
  }
  
  return data;
}

export const api = {
  get: (u) => apiFetch(u),
  post: (u, b) => apiFetch(u, { method: 'POST', body: JSON.stringify(b) }),
  put: (u, b) => apiFetch(u, { method: 'PUT', body: JSON.stringify(b) }),
  patch: (u, b) => apiFetch(u, { method: 'PATCH', body: JSON.stringify(b) }),
  del: (u) => apiFetch(u, { method: 'DELETE' })
};