import axios from "axios";

const hasIpc =
  typeof window !== "undefined" && window.api && window.api.reports;
const http = axios.create({ baseURL: "http://localhost:3001" });

export async function list() {
  if (hasIpc) {
    try {
      return await window.api.reports.list();
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
      return await window.api.reports.create(payload);
    } catch (error) {
      console.warn("IPC reports:create failed, falling back to HTTP", error);
    }
  }

  const body = Array.isArray(payload) ? payload : [payload];
  const { data } = await http.post("/reports", body);
  return data;
}
