// Unified Setups API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc = typeof window !== "undefined" && window.api && window.api.setups;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    const res = await window.api.setups.list();
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get("/setups");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    const res = await window.api.setups.create(payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.post("/setups", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) {
    const res = await window.api.setups.get(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get(`/setups/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) {
    const res = await window.api.setups.update(id, payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.put(`/setups/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) {
    const res = await window.api.setups.delete(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.delete(`/setups/${id}`);
  return data;
}
