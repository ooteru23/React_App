// Unified Controls API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.controls;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    const res = await window.api.controls.list();
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get("/controls");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    const res = await window.api.controls.create(payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.post("/controls", payload);
  return data;
}
