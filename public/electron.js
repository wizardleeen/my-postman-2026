const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const isDev = process.env.ELECTRON_IS_DEV === 'true'
const axios = require('axios')

let mainWindow

function createWindow() {
  // 创建主窗口
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  })

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // 开发模式下打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // 创建应用菜单
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Request',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-request')
          }
        },
        {
          label: 'Import Collection',
          click: () => {
            // TODO: 实现导入功能
          }
        },
        {
          label: 'Export Collection',
          click: () => {
            // TODO: 实现导出功能
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            // TODO: 显示关于对话框
          }
        }
      ]
    }
  ]

  // macOS 菜单调整
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// HTTP 请求处理
ipcMain.handle('make-http-request', async (event, { method, url, headers, body }) => {
  try {
    const startTime = Date.now()
    
    const config = {
      method: method.toLowerCase(),
      url: url,
      headers: headers || {},
      timeout: 30000, // 30秒超时
      validateStatus: () => true // 接受所有状态码
    }

    // 添加请求体（如果需要）
    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
      config.data = body
    }

    const response = await axios(config)
    const endTime = Date.now()

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: typeof response.data === 'object' 
        ? JSON.stringify(response.data, null, 2) 
        : String(response.data),
      responseTime: endTime - startTime
    }
  } catch (error) {
    console.error('HTTP request failed:', error)
    throw new Error(error.message || 'Request failed')
  }
})

// 应用事件处理
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 阻止导航到外部链接
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
  })
})