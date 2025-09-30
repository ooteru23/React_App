const { contextBridge, ipcRenderer } = require("electron");

// Expose a safe, typed API to the renderer
contextBridge.exposeInMainWorld("api", {
  employees: {
    list: () => ipcRenderer.invoke("employees:list"),
    create: (payload) => ipcRenderer.invoke("employees:create", payload),
    get: (id) => ipcRenderer.invoke("employees:get", id),
    update: (id, payload) =>
      ipcRenderer.invoke("employees:update", id, payload),
    delete: (id) => ipcRenderer.invoke("employees:delete", id),
  },
  offers: {
    list: () => ipcRenderer.invoke("offers:list"),
    create: (payload) => ipcRenderer.invoke("offers:create", payload),
    get: (id) => ipcRenderer.invoke("offers:get", id),
    update: (id, payload) => ipcRenderer.invoke("offers:update", id, payload),
    delete: (id) => ipcRenderer.invoke("offers:delete", id),
  },
  clients: {
    list: () => ipcRenderer.invoke("clients:list"),
    create: (payload) => ipcRenderer.invoke("clients:create", payload),
    get: (id) => ipcRenderer.invoke("clients:get", id),
    update: (id, payload) => ipcRenderer.invoke("clients:update", id, payload),
    delete: (id) => ipcRenderer.invoke("clients:delete", id),
  },
  setups: {
    list: () => ipcRenderer.invoke("setups:list"),
    create: (payload) => ipcRenderer.invoke("setups:create", payload),
    get: (id) => ipcRenderer.invoke("setups:get", id),
    update: (id, payload) => ipcRenderer.invoke("setups:update", id, payload),
    delete: (id) => ipcRenderer.invoke("setups:delete", id),
  },
  controls: {
    list: () => ipcRenderer.invoke("controls:list"),
    create: (payload) => ipcRenderer.invoke("controls:create", payload),
  },
  bonuses: {
    list: () => ipcRenderer.invoke("bonuses:list"),
    create: (payload) => ipcRenderer.invoke("bonuses:create", payload),
    delete: (id) => ipcRenderer.invoke("bonuses:delete", id),
  },
  reports: {
    list: () => ipcRenderer.invoke("reports:list"),
    create: (payload) => ipcRenderer.invoke("reports:create", payload),
  },
});
