import React, { useState, useEffect } from 'react'
import { Send, Clock, AlertCircle } from 'lucide-react'
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
  const [corsError, setCorsError] = useState(false)

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
    setCorsError(false)

    try {
      // Prepare headers object
      const headers: Record<string, string> = {
        'Content-Type': 'application/json' // Default content type
      }
      
      currentRequest.headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          headers[header.key.trim()] = header.value.trim()
        }
      })

      const startTime = Date.now()
      
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: currentRequest.method,
        headers,
        mode: 'cors' // Enable CORS
      }

      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(currentRequest.method) && currentRequest.body.trim()) {
        fetchOptions.body = currentRequest.body
      }

      const fetchResponse = await fetch(currentRequest.url, fetchOptions)
      const endTime = Date.now()
      
      // Get response headers
      const responseHeaders: Record<string, string> = {}
      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Get response body
      let responseBody = ''
      try {
        const contentType = fetchResponse.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const jsonData = await fetchResponse.json()
          responseBody = JSON.stringify(jsonData, null, 2)
        } else {
          responseBody = await fetchResponse.text()
        }
      } catch (e) {
        responseBody = 'Failed to parse response body'
      }

      const responseData: Response = {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        body: responseBody,
        responseTime: endTime - startTime
      }

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
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setCorsError(true)
      }
      
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
    setCorsError(false)
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
        {corsError && (
          <div className="cors-warning">
            <AlertCircle size={16} />
            <span>
              CORS Error: The target server doesn't allow requests from this domain. 
              Try using a CORS proxy or test with APIs that support CORS.
            </span>
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