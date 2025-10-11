# 字典Hook使用指南

## 概述

本项目提供了三个字典相关的Hook，用于获取预加载的字典数据。**字典数据在应用启动时预加载，使用时直接从内存中获取，无需重复请求**。

## Hook列表

### useDict - 通用字典Hook

获取指定编码的字典数据，支持任意字典。

```typescript
import { useDict } from './useDict';

const MyComponent = () => {
  const { dictOptions, loading, error, refresh } = useDict('STATUS');
  
  return (
    <Select loading={loading}>
      {dictOptions.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};
```

## 使用场景

### 场景1：状态选择器
```typescript
// 用户管理、组织管理等页面的状态选择
const { dictOptions: statusOptions, loading } = useDict('STATUS');
```

### 场景2：自定义字典选择器
```typescript
// 用户类型选择
const { dictOptions: userTypeOptions, loading } = useDict('USER_TYPE');

// 优先级选择
const { dictOptions: priorityOptions, loading } = useDict('PRIORITY');
```

### 场景3：动态字典选择器
```typescript
// 根据props动态选择字典
const MyComponent = ({ dictCode }: { dictCode: string }) => {
  const { dictOptions, loading } = useDict(dictCode);
  
  return (
    <Select loading={loading}>
      {dictOptions.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};
```

## 预加载机制

1. **应用启动时预加载**：在 `App.tsx` 中调用 `loadAllDicts()` 预加载所有字典数据
2. **内存存储**：字典数据存储在 Zustand store 中，全局共享
3. **即时获取**：组件使用时直接从内存获取，无需等待网络请求
4. **按需加载**：如果某个字典未预加载，会在首次使用时自动加载

## 注意事项

1. **排序**：字典项按后台的 `sort` 字段排序，前端不需要额外排序
2. **错误处理**：所有Hook都包含错误处理，失败时会提供空数组或默认选项
3. **加载状态**：所有Hook都提供 `loading` 状态，可用于显示加载指示器
4. **刷新功能**：所有Hook都提供 `refresh` 方法，可用于手动刷新字典数据
5. **预加载优势**：页面打开时数据已准备好，用户体验更好

## API参数

### useDict(dictCode: string)
- `dictCode`: 字典编码，如 'STATUS', 'USER_TYPE' 等

### 返回值
- `dictOptions`: 字典选项数组，格式为 `{ label: string, value: string | number }[]`
- `loading`: 加载状态
- `error`: 错误信息
- `refresh`: 刷新函数
