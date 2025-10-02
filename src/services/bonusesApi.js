// Unified Bonuses API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.bonuses;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    const res = await window.api.bonuses.list();
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get("/bonuses");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    const res = await window.api.bonuses.create(payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.post("/bonuses", payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) {
    try {
      const res = await window.api.bonuses.delete(id);
      if (res?.error) throw new Error(res.error.message || "IPC error");
      return res.data;
    } catch (error) {
      console.warn("IPC bonuses:delete failed, falling back to HTTP", error);
    }
  }

  const { data } = await http.delete(`/bonuses/${id}`);
  return data;
}
