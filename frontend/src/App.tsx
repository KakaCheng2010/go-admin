import { useEffect } from 'react';
import AppRoutes from './router';
import { useDictStore } from './store/dictStore';

function App() {
  const { loadAllDicts } = useDictStore();

  useEffect(() => {
    // 应用启动时预加载所有字典数据
    loadAllDicts();
  }, [loadAllDicts]);

  return <AppRoutes />;
}

export default App;
