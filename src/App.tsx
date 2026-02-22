import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import Sidebar from './components/Sidebar'
import { Request, Response, HistoryItem } from './types'

// 检查是否在 Electron 环境中
const isElectron = typeof window !== 'undefined' && window.electronAPI

const App: React.FC = () => {
  const [currentRequest, setCurrentRequest] = useState<Request>({
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '' }],
    body: ''
  })
  
  const [response, setResponse] = useState<Response | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [error, setError] = useState<string>('')

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('postman-history')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
  }, [])

  // 保存历史记录
  useEffect(() => {
    localStorage.setItem('postman-history', JSON.stringify(history))
  }, [history])

  // 监听 Electron 新请求事件
  useEffect(() => {
    if (isElectron && window.electronAPI) {
      const handleNewRequest = () => {
        setCurrentRequest({
          method: 'GET',
          url: '',
          headers: [{ key: '', value: '' }],
          body: ''
        })
        setResponse(null)
        setError('')
      }

      window.electronAPI.onNewRequest(handleNewRequest)
      
      return () => {
        window.electronAPI.removeAllListeners('new-request')
      }
    }
  }, [])

  const handleSendRequest = async () => {
    if (!currentRequest.url.trim()) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setResponse(null)
    setError('')

    try {
      // 准备请求头
      const headers: Record<string, string> = {}
      currentRequest.headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          headers[header.key.trim()] = header.value.trim()
        }
      })

      let responseData: Response

      if (isElectron && window.electronAPI) {
        // Electron 环境：使用主进程的 HTTP 客户端
        responseData = await window.electronAPI.makeHttpRequest({
          method: currentRequest.method,
          url: currentRequest.url,
          headers: headers,
          body: currentRequest.body || null
        })
      } else {
        // Web 环境：使用 fetch（备用）
        const startTime = Date.now()
        
        const fetchOptions: RequestInit = {
          method: currentRequest.method,
          headers: headers,
          mode: 'cors'
        }

        if (['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && currentRequest.body.trim()) {
          fetchOptions.body = currentRequest.body
        }

        const fetchResponse = await fetch(currentRequest.url, fetchOptions)
        const endTime = Date.now()
        
        const responseHeaders: Record<string, string> = {}
        fetchResponse.headers.forEach((value, key) => {
          responseHeaders[key] = value
        })

        let responseBody = ''
        try {
          const contentType = fetchResponse.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const jsonData = await fetchResponse.json()
            responseBody = JSON.stringify(jsonData, null, 2)
          } else {
            responseBody = await fetchResponse.text()
          }
        } catch {
          responseBody = 'Failed to parse response body'
        }

        responseData = {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: responseHeaders,
          body: responseBody,
          responseTime: endTime - startTime
        }
      }

      setResponse(responseData)

      // 添加到历史记录
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        method: currentRequest.method,
        url: currentRequest.url,
        timestamp: new Date().toISOString(),
        status: responseData.status
      }

      setHistory(prev => [historyItem, ...prev.slice(0, 99)]) // 保留最近 100 条

    } catch (err) {
      console.error('Request failed:', err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      
      setResponse({
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        body: `Error: ${errorMessage}`,
        responseTime: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (item: HistoryItem) => {
    setCurrentRequest({
      method: item.method,
      url: item.url,
      headers: [{ key: '', value: '' }],
      body: ''
    })
    setResponse(null)
    setError('')
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="app">
      <Sidebar 
        history={history} 
        onHistoryClick={handleHistoryClick}
        onClearHistory={clearHistory}
        isElectron={isElectron}
      />
      
      <div className="main-content">
        {!isElectron && (
          <div className="web-notice">
            <AlertCircle size={16} />
            <span>
              Running in web mode. For the best experience, download the desktop app.
            </span>
          </div>
        )}
        
        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <RequestPanel 
          request={currentRequest}
          onChange={setCurrentRequest}
          onSend={handleSendRequest}
          loading={loading}
        />
        
        <ResponsePanel 
          response={response}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default App