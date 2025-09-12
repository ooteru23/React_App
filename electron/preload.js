const { contextBridge, ipcRenderer } = require("electron");

// Expose a safe, typed API to the renderer
contextBridge.exposeInMainWorld("api", {
  employees: {
    list: () => ipcRenderer.invoke("employees:list"),
    create: (payload) => ipcRenderer.invoke("employees:create", payload),
    get: (id) => ipcRenderer.invoke("employees:get", id),
    update: (id, payload) => ipcRenderer.invoke("employees:update", id, payload),
    delete: (id) => ipcRenderer.invoke("employees:delete", id),
  },
});
