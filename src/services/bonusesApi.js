// Unified Bonuses API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.bonuses;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) return window.api.bonuses.list();
  const { data } = await http.get("/bonuses");
  return data;
}

export async function create(payload) {
  if (hasIpc) return window.api.bonuses.create(payload);
  const { data } = await http.post("/bonuses", payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) {
    try {
      return await window.api.bonuses.delete(id);
    } catch (error) {
      console.warn("IPC bonuses:delete failed, falling back to HTTP", error);
    }
  }

  const { data } = await http.delete(`/bonuses/${id}`);
  return data;
}
