// Unified Controls API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.controls;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) return window.api.controls.list();
  const { data } = await http.get("/controls");
  return data;
}

export async function create(payload) {
  if (hasIpc) return window.api.controls.create(payload);
  const { data } = await http.post("/controls", payload);
  return data;
}
