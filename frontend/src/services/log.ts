import api from './api';

export interface AccessLogItem {
  id: string;
  username: string;
  path: string;
  method: string;
  ip: string;
  status_code: number;
  user_agent: string;
  latency_ms: number;
  created_at: string;
}

export interface AccessLogQuery {
  username?: string;
  path?: string;
  start_time?: string; // ISO string
  end_time?: string;   // ISO string
  page?: number;
  page_size?: number;
}

export interface AccessLogPaged {
  total: number;
  items: AccessLogItem[];
}

export async function getAccessLogs(params: AccessLogQuery): Promise<AccessLogPaged> {
  const { data } = await api.get('/logs', { params });
  return data;
}

export async function batchDeleteAccessLogs(ids: string[]): Promise<void> {
  await api.delete('/logs/batch', { data: { ids: ids.map(id => parseInt(id)) } });
}


