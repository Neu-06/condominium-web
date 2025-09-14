export function setToken(t){ localStorage.setItem('token', t); }
export function getToken(){ return localStorage.getItem('token'); }
export function setUser(u){ localStorage.setItem('user', JSON.stringify(u)); }
export function getUser(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
export function clearAuth(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}