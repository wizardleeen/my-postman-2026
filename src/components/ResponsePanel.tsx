import React from 'react'
import { Response } from '../types'

interface ResponsePanelProps {
  response: Response | null
  loading: boolean
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, loading }) => {
  const [activeTab, setActiveTab] = React.useState('body')

  const formatJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  const getStatusClass = (status: number) => {
    if (status >= 200 && status < 300) return 'status-success'
    if (status >= 400) return 'status-error'
    return ''
  }

  if (loading) {
    return (
      <div className="response-panel">
        <div className="loading">Sending request...</div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="response-panel">
        <div className="loading">Send a request to see the response here</div>
      </div>
    )
  }

  return (
    <div className="response-panel">
      <div className="response-header">
        <span className={getStatusClass(response.status)}>
          Status: {response.status} {response.statusText}
        </span>
        <span style={{ marginLeft: '20px', color: '#666' }}>
          Time: {response.responseTime}ms
        </span>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Response Body
        </button>
        <button 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers ({Object.keys(response.headers).length})
        </button>
      </div>

      <div className="response-content">
        {activeTab === 'body' && (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {response.body ? formatJson(response.body) : '(Empty response)'}
          </pre>
        )}

        {activeTab === 'headers' && (
          <div>
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '8px', fontFamily: 'monospace' }}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
            {Object.keys(response.headers).length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                No headers received
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResponsePanel