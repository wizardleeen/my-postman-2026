import React from 'react'
import { Clock, Trash2 } from 'lucide-react'
import { HistoryItem } from '../types'

interface SidebarProps {
  history: HistoryItem[]
  onHistoryClick: (item: HistoryItem) => void
  onClearHistory: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ history, onHistoryClick, onClearHistory }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getMethodClass = (method: string) => {
    return `history-method method-${method.toLowerCase()}`
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>
          <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Request History
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ecf0f1', 
              cursor: 'pointer',
              padding: '5px'
            }}
            title="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <ul className="history-list">
        {history.length === 0 ? (
          <li style={{ color: '#bdc3c7', fontStyle: 'italic', padding: '10px 0' }}>
            No requests yet
          </li>
        ) : (
          history.map((item) => (
            <li
              key={item.id}
              className="history-item"
              onClick={() => onHistoryClick(item)}
              title={item.url}
            >
              <div style={{ marginBottom: '5px' }}>
                <span className={getMethodClass(item.method)}>
                  {item.method}
                </span>
                <span className={item.status >= 400 ? 'status-error' : 'status-success'}>
                  {item.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '3px' }}>
                {formatUrl(item.url)}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>
                {formatTime(item.timestamp)}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default Sidebar