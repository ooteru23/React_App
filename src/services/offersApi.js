// Unified Offers API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc = typeof window !== "undefined" && window.api && window.api.offers;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) return window.api.offers.list();
  const { data } = await http.get("/offers");
  return data;
}

export async function create(payload) {
  if (hasIpc) return window.api.offers.create(payload);
  const { data } = await http.post("/offers", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) return window.api.offers.get(id);
  const { data } = await http.get(`/offers/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) return window.api.offers.update(id, payload);
  const { data } = await http.put(`/offers/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) return window.api.offers.delete(id);
  const { data } = await http.delete(`/offers/${id}`);
  return data;
}
