import { getToken, clearAuth } from "./auth.js";

// Configuración automática de entorno
const getApiBase = () => {
  // 1. Si hay variable de entorno, usarla
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // 2. Detectar entorno automáticamente
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDev = import.meta.env.DEV;
  
  // 3. Configuración por entorno
  if (isDev && isLocal) {
    return "http://localhost:8000"; // Desarrollo local
  } else {
    return "https://condominium-api-staging.up.railway.app"; // Producción
  }
};

const API_BASE = getApiBase();

console.log('🚀 Entorno:', import.meta.env.DEV ? 'Desarrollo' : 'Producción');
console.log('🌐 API_BASE configurado:', API_BASE);
console.log('🔍 VITE_API_BASE desde .env:', import.meta.env.VITE_API_BASE);

export async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // SIEMPRE construir URL completa
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  console.log('📡 Request final a:', fullUrl);

  try {
    const res = await fetch(fullUrl, { ...options, headers });

    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      console.error('❌ Error parsing JSON:', e);
      // Si no es JSON, intentar obtener texto
      const text = await res.text();
      throw new Error(`Respuesta no válida: ${text.substring(0, 100)}`);
    }

    if (res.status === 401) {
      clearAuth();
      if (!url.includes('/login')) window.location.href = '/login';
    }
    
    if (!res.ok) {
      throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('🔥 Error en API request:', error);
    throw error;
  }
}

export const api = {
  get: (u) => apiFetch(u),
  post: (u, b) => apiFetch(u, { method: 'POST', body: JSON.stringify(b) }),
  put: (u, b) => apiFetch(u, { method: 'PUT', body: JSON.stringify(b) }),
  patch: (u, b) => apiFetch(u, { method: 'PATCH', body: JSON.stringify(b) }),
  del: (u) => apiFetch(u, { method: 'DELETE' })
};