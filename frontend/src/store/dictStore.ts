import { create } from 'zustand';
import { dictService, DictItem } from '../services/dict';

export interface DictData {
  [dictCode: string]: DictItem[];
}

interface DictStore {
  dictData: DictData;
  loading: boolean;
  error: string | null;
  loadDict: (dictCode: string) => Promise<void>;
  loadAllDicts: () => Promise<void>;
  getDictOptions: (dictCode: string, valueType?: 'string' | 'number') => Array<{ label: string; value: string | number }>;
  getStatusOptions: () => Array<{ label: string; value: string }>;
}

export const useDictStore = create<DictStore>((set, get) => ({
  dictData: {},
  loading: false,
  error: null,

  loadDict: async (dictCode: string) => {
    const { dictData } = get();
    
    // 如果已经加载过，直接返回
    if (dictData[dictCode]) {
      return;
    }

    set({ loading: true, error: null });
    
    try {
      const dictItems = await dictService.getDictItems(dictCode);
      set(state => ({
        dictData: {
          ...state.dictData,
          [dictCode]: dictItems
        },
        loading: false
      }));
    } catch (error: any) {
      console.error(`加载字典 ${dictCode} 失败:`, error);
      set({ 
        error: error.message || '加载字典失败',
        loading: false 
      });
    }
  },

  loadAllDicts: async () => {
    set({ loading: true, error: null });
    
    try {
      // 获取所有字典列表
      const dicts = await dictService.getDicts();
      
      // 并行加载所有字典的字典项
      const dictPromises = dicts.map(dict => 
        dictService.getDictItems(dict.id).then(items => ({ dictCode: dict.code, items }))
      );
      
      const results = await Promise.all(dictPromises);
      
      const dictData: DictData = {};
      results.forEach(({ dictCode, items }) => {
        dictData[dictCode] = items;
      });
      
      set({ dictData, loading: false });
    } catch (error: any) {
      console.error('加载所有字典失败:', error);
      set({ 
        error: error.message || '加载字典失败',
        loading: false 
      });
    }
  },

  getDictOptions: (dictCode: string, valueType: 'string' | 'number' = 'string') => {
    const { dictData } = get();
    const dictItems = dictData[dictCode] || [];
    
    return dictItems.map(item => ({
      label: item.label,
      value: valueType === 'number' 
        ? (typeof item.value === 'string' ? parseInt(item.value) : item.value)
        : String(item.value) // 确保返回字符串
    })) as Array<{ label: string; value: string | number }>;
  },

  getStatusOptions: () => {
    const { dictData } = get();
    const dictItems = dictData['status'] || [];
    
    // 如果状态字典加载失败，返回默认选项
    if (dictItems.length === 0) {
      return [
        { label: '正常', value: '1' },
        { label: '禁用', value: '0' }
      ];
    }
    
    return dictItems.map(item => ({
      label: item.label,
      value: String(item.value) // 确保返回字符串
    }));
  }
}));
