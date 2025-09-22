// Unified Setups API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc = typeof window !== "undefined" && window.api && window.api.setups;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) return window.api.setups.list();
  const { data } = await http.get("/setups");
  return data;
}

export async function create(payload) {
  if (hasIpc) return window.api.setups.create(payload);
  const { data } = await http.post("/setups", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) return window.api.setups.get(id);
  const { data } = await http.get(`/setups/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) return window.api.setups.update(id, payload);
  const { data } = await http.put(`/setups/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) return window.api.setups.delete(id);
  const { data } = await http.delete(`/setups/${id}`);
  return data;
}
