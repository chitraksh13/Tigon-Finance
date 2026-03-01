const BASE_URL = "http://localhost:5000";

// -------------------- HELPER --------------------

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(res) {
  // Auto logout on invalid token
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  // Handle other errors safely
  if (!res.ok) {
    console.error("API Error:", res.status);
    return null;
  }

  // Some responses might not have JSON
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// -------------------- API METHODS --------------------

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiPut(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
