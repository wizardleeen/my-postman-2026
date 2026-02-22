const { contextBridge, ipcRenderer } = require('electron')

// 向渲染进程暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // HTTP 请求
  makeHttpRequest: (requestData) => {
    return ipcRenderer.invoke('make-http-request', requestData)
  },
  
  // 监听主进程消息
  onNewRequest: (callback) => {
    ipcRenderer.on('new-request', callback)
  },
  
  // 移除监听器
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
  
  // 获取平台信息
  platform: process.platform,
  
  // 应用信息
  appVersion: process.env.npm_package_version || '1.0.0'
})