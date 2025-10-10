# Go-Admin 项目结构说明

## 整体架构

```
go-admin/
├── backend/                 # Go后端服务
│   ├── cmd/               # 应用入口
│   │   └── main.go        # 主程序入口
│   ├── internal/          # 内部包（不对外暴露）
│   │   ├── api/           # API处理器层
│   │   │   ├── auth.go    # 认证相关API
│   │   │   └── user.go    # 用户管理API
│   │   ├── config/        # 配置管理
│   │   │   └── config.go  # 配置结构定义
│   │   ├── database/      # 数据库连接
│   │   │   └── database.go # 数据库初始化
│   │   ├── middleware/    # 中间件
│   │   │   ├── auth.go    # 认证中间件
│   │   │   ├── cors.go    # CORS中间件
│   │   │   ├── cache.go   # 缓存中间件
│   │   │   └── middleware.go # 中间件配置
│   │   ├── model/         # 数据模型
│   │   │   ├── user.go    # 用户模型
│   │   │   ├── organization.go # 组织模型
│   │   │   ├── role.go    # 角色模型
│   │   │   ├── menu.go    # 菜单模型
│   │   │   └── dict.go    # 字典模型
│   │   ├── router/        # 路由配置
│   │   │   └── router.go  # 路由定义
│   │   ├── service/       # 业务逻辑层
│   │   │   ├── auth.go    # 认证服务
│   │   │   ├── user.go    # 用户服务
│   │   │   ├── cache.go   # 缓存服务
│   │   │   └── session.go # 会话服务
│   │   └── utils/         # 工具函数
│   │       ├── jwt.go     # JWT工具
│   │       └── password.go # 密码工具
│   ├── scripts/           # 脚本文件
│   │   └── init_data.go   # 初始化数据脚本
│   ├── configs/           # 配置文件
│   │   └── config.yaml    # 应用配置
│   ├── Dockerfile         # Docker构建文件
│   ├── go.mod            # Go模块依赖
│   └── go.sum            # 依赖校验文件
├── frontend/               # React前端应用
│   ├── public/           # 静态资源
│   │   └── index.html    # HTML模板
│   ├── src/              # 源代码
│   │   ├── components/   # 公共组件
│   │   │   └── Layout.tsx # 布局组件
│   │   ├── pages/        # 页面组件
│   │   │   ├── Login.tsx  # 登录页面
│   │   │   ├── Dashboard.tsx # 仪表盘
│   │   │   ├── UserManagement.tsx # 用户管理
│   │   │   ├── OrganizationManagement.tsx # 组织管理
│   │   │   ├── RoleManagement.tsx # 角色管理
│   │   │   ├── MenuManagement.tsx # 菜单管理
│   │   │   └── DictManagement.tsx # 字典管理
│   │   ├── services/     # API服务
│   │   │   ├── api.ts    # API客户端
│   │   │   ├── auth.ts   # 认证服务
│   │   │   └── user.ts   # 用户服务
│   │   ├── store/        # 状态管理
│   │   │   └── authStore.ts # 认证状态
│   │   ├── App.tsx       # 应用根组件
│   │   ├── index.tsx     # 应用入口
│   │   └── index.css     # 全局样式
│   ├── Dockerfile        # Docker构建文件
│   ├── nginx.conf        # Nginx配置
│   └── package.json      # 依赖配置
├── docker-compose.yml    # Docker编排文件
├── start.sh             # Linux/Mac启动脚本
├── start.bat            # Windows启动脚本
├── .gitignore           # Git忽略文件
├── README.md            # 项目说明
└── PROJECT_STRUCTURE.md # 项目结构说明
```

## 技术栈说明

### 后端技术栈
- **Go 1.21+** - 主要编程语言
- **Gin** - 轻量级Web框架
- **GORM** - ORM数据库操作
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **JWT** - 身份认证
- **Viper** - 配置管理

### 前端技术栈
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Zustand** - 状态管理

### 部署技术
- **Docker** - 容器化
- **Docker Compose** - 服务编排
- **Nginx** - 反向代理

## 核心功能模块

### 1. 用户管理
- 用户CRUD操作
- 用户状态管理
- 角色分配
- 组织分配

### 2. 组织管理
- 树形组织结构
- 层级管理
- 组织权限控制

### 3. 角色管理
- 角色定义
- 权限分配
- 角色继承

### 4. 菜单管理
- 动态菜单
- 权限控制
- 菜单树结构

### 5. 字典管理
- 系统字典
- 字典项管理
- 数据标准化

## 数据流架构

```
前端 (React) 
    ↓ HTTP/HTTPS
后端 (Gin) 
    ↓ ORM
数据库 (PostgreSQL)
    ↓ 缓存
Redis
```

## 安全特性

- JWT身份认证
- 密码加密存储
- 权限控制中间件
- CORS跨域处理
- 会话管理
- 缓存安全

## 开发规范

### 后端规范
- 使用Gin框架
- 遵循RESTful API设计
- 统一的错误处理
- 中间件模式
- 服务层分离

### 前端规范
- 函数式组件
- TypeScript类型定义
- 组件化开发
- 状态管理
- 响应式设计

## 部署说明

### 开发环境
1. 启动数据库和Redis: `docker-compose up -d postgres redis`
2. 启动后端: `cd backend && go run cmd/main.go`
3. 启动前端: `cd frontend && npm start`

### 生产环境
1. 使用Docker Compose: `docker-compose up -d`
2. 配置环境变量
3. 设置数据库连接
4. 配置Redis连接
5. 部署到服务器
