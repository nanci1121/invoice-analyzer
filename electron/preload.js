const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getInvoices: () => ipcRenderer.invoke('db:get-invoices'),
  addInvoice: (invoice) => ipcRenderer.invoke('db:add-invoice', invoice),
  deleteInvoice: (id) => ipcRenderer.invoke('db:delete-invoice', id)
});
