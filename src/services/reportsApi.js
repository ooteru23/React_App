import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.reports;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    try {
      const res = await window.api.reports.list();
      if (res?.error) throw new Error(res.error.message || "IPC error");
      return res.data;
    } catch (error) {
      console.warn("IPC reports:list failed, falling back to HTTP", error);
    }
  }
  const { data } = await http.get("/reports");
  return data;
}

export async function create(payload) {
  if (hasIpc) {
    try {
      const res = await window.api.reports.create(payload);
      if (res?.error) throw new Error(res.error.message || "IPC error");
      return res.data;
    } catch (error) {
      console.warn("IPC reports:create failed, falling back to HTTP", error);
    }
  }

  const body = Array.isArray(payload) ? payload : [payload];
  const { data } = await http.post("/reports", body);
  return data;
}
