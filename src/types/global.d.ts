interface ElectronAPI {
  makeHttpRequest: (requestData: {
    method: string
    url: string
    headers: Record<string, string>
    body?: string | null
  }) => Promise<{
    status: number
    statusText: string
    headers: Record<string, string>
    body: string
    responseTime: number
  }>
  onNewRequest: (callback: () => void) => void
  removeAllListeners: (channel: string) => void
  platform: string
  appVersion: string
}

interface Window {
  electronAPI?: ElectronAPI
}

declare const __IS_DEV__: boolean