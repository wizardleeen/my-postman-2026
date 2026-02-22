import React from 'react'
import { Request } from '../types'
import { Send } from 'lucide-react'

interface RequestPanelProps {
  request: Request
  onChange: (request: Request) => void
  onSend: () => void
  loading: boolean
}

const RequestPanel: React.FC<RequestPanelProps> = ({ request, onChange, onSend, loading }) => {
  const [activeTab, setActiveTab] = React.useState('headers')

  const handleMethodChange = (method: string) => {
    onChange({ ...request, method })
  }

  const handleUrlChange = (url: string) => {
    onChange({ ...request, url })
  }

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...request.headers]
    newHeaders[index][field] = value
    onChange({ ...request, headers: newHeaders })
  }

  const addHeader = () => {
    onChange({ ...request, headers: [...request.headers, { key: '', value: '' }] })
  }

  const removeHeader = (index: number) => {
    const newHeaders = request.headers.filter((_, i) => i !== index)
    onChange({ ...request, headers: newHeaders.length ? newHeaders : [{ key: '', value: '' }] })
  }

  const handleBodyChange = (body: string) => {
    onChange({ ...request, body })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onSend()
    }
  }

  return (
    <div className="request-panel">
      <div className="url-bar">
        <select 
          className="method-select" 
          value={request.method} 
          onChange={(e) => handleMethodChange(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        
        <input
          type="text"
          className="url-input"
          placeholder="Enter request URL..."
          value={request.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <button 
          className="send-button" 
          onClick={onSend} 
          disabled={loading || !request.url.trim()}
        >
          {loading ? (
            'Sending...'
          ) : (
            <>
              <Send size={16} style={{ marginRight: '5px' }} />
              Send
            </>
          )}
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </button>
        <button 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'headers' && (
          <div>
            <div className="headers-grid" style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '13px' }}>
              <div>Key</div>
              <div>Value</div>
              <div></div>
            </div>
            {request.headers.map((header, index) => (
              <div key={index} className="headers-grid">
                <input
                  type="text"
                  className="header-input"
                  placeholder="Header name"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  className="header-input"
                  placeholder="Header value"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                />
                <button 
                  className="remove-button"
                  onClick={() => removeHeader(index)}
                  disabled={request.headers.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button className="add-button" onClick={addHeader}>
              Add Header
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <div>
            <textarea
              className="body-textarea"
              placeholder="Enter request body (JSON, XML, text, etc.)..."
              value={request.body}
              onChange={(e) => handleBodyChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestPanel