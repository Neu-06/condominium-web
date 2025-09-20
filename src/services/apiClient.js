import { getToken, clearAuth } from "./auth.js";

// Configuración simple y directa
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

console.log('🌐 API_BASE:', API_BASE);

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // En desarrollo local: usar proxy (/api)
  // En producción: usar URL completa
  const isDev = import.meta.env.DEV;
  const isLocal = window.location.hostname === 'localhost';
  
  let fullUrl;
  if (isDev && isLocal) {
    // Desarrollo local: usar rutas relativas (proxy se encarga)
    fullUrl = url;
  } else {
    // Producción: URL completa
    fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  }
  
  console.log('📡 Request a:', fullUrl);

  const res = await fetch(fullUrl, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    console.error('❌ Error parsing JSON:', e);
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