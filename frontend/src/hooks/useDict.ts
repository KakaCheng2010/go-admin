import { useDictStore } from '../store/dictStore';

export interface DictOption {
  label: string;
  value: string | number;
}

export const useDict = (dictCode: string) => {
  const { dictData, loading, error, loadDict } = useDictStore();
  
  const dictOptions: DictOption[] = dictData[dictCode]?.map(item => ({
    label: item.label,
    value: String(item.value) // 确保所有字典值都是字符串
  })) || [];

  return {
    dictOptions,
    loading,
    error,
    refresh: () => loadDict(dictCode)
  };
};
