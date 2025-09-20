import { getToken, clearAuth } from "./auth.js";

// Hardcodear temporalmente para que funcione YA
const API_BASE = "https://condominium-api-staging.up.railway.app";

console.log('Entorno:', import.meta.env.DEV ? 'Desarrollo' : 'Producción');
console.log('API_BASE forzado:', API_BASE);

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // FORZAR URL completa SIEMPRE
  let fullUrl;
  if (url.startsWith('http')) {
    fullUrl = url;
  } else {
    // SIEMPRE construir URL completa
    fullUrl = API_BASE + url;
  }
  
  console.log('Request FORZADO a:', fullUrl);

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