import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { Send, Clock, Settings } from 'lucide-react'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import Sidebar from './components/Sidebar'
import { Request, Response, HistoryItem } from './types'

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

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('http-client-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('http-client-history', JSON.stringify(history))
  }, [history])

  const handleSendRequest = async () => {
    if (!currentRequest.url.trim()) {
      alert('Please enter a URL')
      return
    }

    setLoading(true)
    setResponse(null)

    try {
      // Prepare headers object
      const headers: Record<string, string> = {}
      currentRequest.headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          headers[header.key.trim()] = header.value.trim()
        }
      })

      // Call Tauri backend to make HTTP request
      const result = await invoke('make_http_request', {
        method: currentRequest.method,
        url: currentRequest.url,
        headers,
        body: currentRequest.body || null
      })

      const responseData = result as Response
      setResponse(responseData)

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        method: currentRequest.method,
        url: currentRequest.url,
        timestamp: new Date().toISOString(),
        status: responseData.status
      }

      setHistory(prev => [historyItem, ...prev.slice(0, 49)]) // Keep last 50 items

    } catch (error) {
      console.error('Request failed:', error)
      setResponse({
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        body: `Error: ${error}`,
        responseTime: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (item: HistoryItem) => {
    // Find the full request from history if available, or create a basic one
    setCurrentRequest({
      method: item.method,
      url: item.url,
      headers: [{ key: '', value: '' }],
      body: ''
    })
    setResponse(null)
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
      />
      
      <div className="main-content">
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