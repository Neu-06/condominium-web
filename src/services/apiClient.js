const API_BASE = "/api"; // relativo, el proxy en dev y Nginx en prod lo resuelven

import { getToken, clearAuth } from "./auth.js";

export async function apiFetch(url, options={}){
  const token = getToken();
  const headers = {
    'Content-Type':'application/json',
    ...(options.headers||{})
  };
  if(token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
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

export function setToken(t){
  localStorage.setItem('token', t);
}
