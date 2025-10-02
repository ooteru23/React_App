// Unified Clients API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.clients;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    const res = await window.api.clients.list();
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get("/clients");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    const res = await window.api.clients.create(payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.post("/clients", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) {
    const res = await window.api.clients.get(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get(`/clients/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) {
    const res = await window.api.clients.update(id, payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.put(`/clients/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) {
    const res = await window.api.clients.delete(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.delete(`/clients/${id}`);
  return data;
}
