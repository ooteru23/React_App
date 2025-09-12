// Unified Employees API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc = typeof window !== "undefined" && window.api && window.api.employees;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) return window.api.employees.list();
  const { data } = await http.get("/employees");
  return data;
}

export async function create(payload) {
  if (hasIpc) return window.api.employees.create(payload);
  const { data } = await http.post("/employees", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) return window.api.employees.get(id);
  const { data } = await http.get(`/employees/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) return window.api.employees.update(id, payload);
  const { data } = await http.put(`/employees/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) return window.api.employees.delete(id);
  const { data } = await http.delete(`/employees/${id}`);
  return data;
}

