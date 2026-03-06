// src/utils/api.js
// Single source of truth for the backend URL.
// Locally:     reads from .env.local  → http://localhost:5000
// Production:  reads from .env.production → your Railway URL
// All pages import from here — never hardcode localhost anywhere else.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
    return null;
  }
  if (!res.ok) {
    console.error("API Error:", res.status);
    return null;
  }
  try { return await res.json(); }
  catch { return null; }
}

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST", headers: getAuthHeaders(), body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE", headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Raw fetch with auth — for pages that build their own fetch calls
export function authFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers || {}) },
  });
}

// Export BASE_URL for Google OAuth redirect (login.jsx uses window.location.href)
export { BASE_URL };