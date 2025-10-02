// Unified Employees API: uses Electron IPC if available, falls back to HTTP (axios)
import axios from "axios";

const hasIpc = typeof window !== "undefined" && window.api && window.api.employees;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    const res = await window.api.employees.list();
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get("/employees");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    const res = await window.api.employees.create(payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.post("/employees", payload);
  return data;
}

export async function getById(id) {
  if (hasIpc) {
    const res = await window.api.employees.get(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.get(`/employees/${id}`);
  return data;
}

export async function update(id, payload) {
  if (hasIpc) {
    const res = await window.api.employees.update(id, payload);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.put(`/employees/${id}`, payload);
  return data;
}

export async function remove(id) {
  if (hasIpc) {
    const res = await window.api.employees.delete(id);
    if (res?.error) throw new Error(res.error.message || "IPC error");
    return res.data;
  }
  const { data } = await http.delete(`/employees/${id}`);
  return data;
}

