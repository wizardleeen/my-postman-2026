export interface Request {
  method: string
  url: string
  headers: Array<{ key: string; value: string }>
  body: string
}

export interface Response {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  responseTime: number
}

export interface HistoryItem {
  id: string
  method: string
  url: string
  timestamp: string
  status: number
}

export interface Environment {
  name: string
  variables: Record<string, string>
}