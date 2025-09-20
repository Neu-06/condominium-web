
import { getToken, clearAuth } from "./auth.js";
const isDevelopment = import.meta.env.DEV;

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function buildUrl(url){
  if(isDevelopment && url.startsWith("/api")){
    return url;
  }
  if(url.startsWith("/api")){
    return `${API_BASE}${url}`;
  }

  return url;

}


export async function apiFetch(url, options={}){
  const token = getToken();
  const headers = {
    'Content-Type':'application/json',
    ...(options.headers||{})
  };
  if(token) headers['Authorization'] = `Bearer ${token}`;

  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, { ...options, headers });

  let data = null;
  try { data = await res.json(); } catch {
    //
    }
  if(res.status === 401){
    clearAuth();
    if(!url.includes('/login')) window.location.href = '/login';
  }
  if(!res.ok){
    throw new Error(data?.detail || data?.error || "Error");
  }
  return data;
}

export const api = {
  get:(u)=>apiFetch(u),
  post:(u,b)=>apiFetch(u,{method:'POST',body:JSON.stringify(b)}),
  put:(u,b)=>apiFetch(u,{method:'PUT',body:JSON.stringify(b)}),
  patch:(u,b)=>apiFetch(u,{method:'PATCH',body:JSON.stringify(b)}),
  del:(u)=>apiFetch(u,{method:'DELETE'})
};