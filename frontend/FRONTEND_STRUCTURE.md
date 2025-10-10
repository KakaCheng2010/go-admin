# 前端项目结构说明

## 📁 新的项目结构

```
frontend/src/
├── components/           # 公共组件
│   └── Layout.tsx       # 布局组件
├── pages/               # 页面组件
│   ├── Login.tsx        # 登录页面
│   ├── Dashboard.tsx    # 仪表盘
│   ├── user/            # 用户管理模块
│   │   ├── UserManagement.tsx
│   │   └── index.ts
│   ├── organization/    # 组织管理模块
│   │   ├── OrganizationManagement.tsx
│   │   └── index.ts
│   ├── role/            # 角色管理模块
│   │   ├── RoleManagement.tsx
│   │   └── index.ts
│   ├── menu/            # 菜单管理模块
│   │   ├── MenuManagement.tsx
│   │   └── index.ts
│   └── dict/            # 字典管理模块
│       ├── DictManagement.tsx
│       └── index.ts
├── router/              # 路由配置
│   ├── index.tsx       # 主路由组件
│   ├── index.ts        # 路由导出
│   ├── routes.ts       # 路由配置
│   └── config.ts       # 路由配置管理
├── services/            # API服务
│   ├── api.ts          # API客户端
│   ├── auth.ts         # 认证服务
│   └── user.ts         # 用户服务
├── store/              # 状态管理
│   └── authStore.ts    # 认证状态
├── App.tsx             # 应用根组件
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 🔧 路由系统重构

### 1. **路由配置文件** (`router/`)
- **`index.tsx`** - 主路由组件，包含所有路由定义
- **`routes.ts`** - 路由配置和菜单配置
- **`config.ts`** - 路由配置管理，支持懒加载
- **`index.ts`** - 路由模块导出

### 2. **模块化页面结构** (`pages/`)
每个管理模块都有独立的文件夹：
- **`user/`** - 用户管理模块
- **`organization/`** - 组织管理模块  
- **`role/`** - 角色管理模块
- **`menu/`** - 菜单管理模块
- **`dict/`** - 字典管理模块

### 3. **路由特性**
- ✅ **模块化路由** - 每个模块独立管理
- ✅ **懒加载支持** - 按需加载页面组件
- ✅ **统一配置** - 集中管理路由配置
- ✅ **类型安全** - TypeScript类型定义

## 🚀 使用方式

### 添加新路由

1. **在 `router/config.ts` 中添加路由配置**：
```typescript
{
  path: '/new-module',
  component: NewModule,
  title: '新模块',
  icon: <NewIcon />,
  key: '/new-module',
}
```

2. **创建页面组件**：
```typescript
// pages/new-module/NewModule.tsx
const NewModule: React.FC = () => {
  return <div>新模块页面</div>;
};
```

3. **创建模块导出文件**：
```typescript
// pages/new-module/index.ts
export { default as NewModule } from './NewModule';
```

### 路由配置管理

- **菜单配置** - 在 `routes.ts` 中管理侧边栏菜单
- **路由定义** - 在 `config.ts` 中定义路由配置
- **懒加载** - 支持组件懒加载，提升性能

## 📋 模块结构规范

每个管理模块都遵循相同的结构：

```
pages/module-name/
├── ModuleName.tsx    # 主组件
└── index.ts          # 导出文件
```

### 模块导出规范：
```typescript
// index.ts
export { default as ModuleName } from './ModuleName';
```

## 🔄 迁移完成

✅ **路由系统重构完成**
✅ **页面模块化完成**  
✅ **配置文件优化完成**
✅ **类型定义完善**

新的项目结构更加清晰，便于维护和扩展！
