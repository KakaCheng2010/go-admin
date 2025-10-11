import api from './api';

export interface Dict {
  id: string;
  name: string;
  code: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface DictItem {
  id: string;
  dict_id: string;
  label: string;
  value: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDictRequest {
  name: string;
  code: string;
  description?: string;
  status?: number;
}

export interface UpdateDictRequest {
  name?: string;
  code?: string;
  description?: string;
  status?: number;
}

export interface CreateDictItemRequest {
  dict_id: string;
  label: string;
  value: string;
  sort?: number;
  status?: number;
}

export interface UpdateDictItemRequest {
  dict_id?: string;
  label?: string;
  value?: string;
  sort?: number;
  status?: number;
}

export interface DictWithItems extends Dict {
  items: DictItem[];
}

export const dictService = {
  // 字典管理
  getDicts: async (): Promise<Dict[]> => {
    const response = await api.get('/dicts');
    return response.data.dicts;
  },

  getDict: async (id: string): Promise<Dict> => {
    const response = await api.get(`/dicts/${id}`);
    return response.data;
  },

  createDict: async (data: CreateDictRequest): Promise<Dict> => {
    const response = await api.post('/dicts', data);
    return response.data.dict;
  },

  updateDict: async (id: string, data: UpdateDictRequest): Promise<Dict> => {
    const response = await api.put(`/dicts/${id}`, data);
    return response.data.dict;
  },

  deleteDict: async (id: string): Promise<void> => {
    await api.delete(`/dicts/${id}`);
  },

  // 字典项管理
  getDictItems: async (dictId: string): Promise<DictItem[]> => {
    const response = await api.get(`/dicts/${dictId}/items`);
    return response.data.items;
  },

  getDictItem: async (id: string): Promise<DictItem> => {
    const response = await api.get(`/dict-items/${id}`);
    return response.data;
  },

  createDictItem: async (data: CreateDictItemRequest): Promise<DictItem> => {
    const response = await api.post('/dict-items', data);
    return response.data.item;
  },

  updateDictItem: async (id: string, data: UpdateDictItemRequest): Promise<DictItem> => {
    const response = await api.put(`/dict-items/${id}`, data);
    return response.data.item;
  },

  deleteDictItem: async (id: string): Promise<void> => {
    await api.delete(`/dict-items/${id}`);
  },

  // 一次性获取所有字典和字典项
  getAllDictsWithItems: async (): Promise<DictWithItems[]> => {
    const response = await api.get('/dicts/all-with-items');
    return response.data.dicts;
  },
};