export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function apiSignup(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function apiListDocuments() {
  const res = await fetch(`${API_BASE}/documents/list`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to load documents");
  return res.json();
}

export async function apiUpload(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function apiQuery(query: string, top_k = 5) {
  const res = await fetch(`${API_BASE}/query/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ query, top_k }),
  });
  if (!res.ok) throw new Error("Query failed");
  return res.json();
}

export async function apiGetContractDetail(docId: string) {
  const res = await fetch(`${API_BASE}/documents/${docId}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to load contract details");
  return res.json();
}
