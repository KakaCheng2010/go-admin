# Go-Admin 开发框架

基于 React + Go + PostgreSQL + Redis 的现代化管理系统开发框架

## 技术栈

### 后端
- **Go 1.21+** - 主要后端语言
- **Gin** - Web框架
- **GORM** - ORM框架
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话存储
- **JWT** - 身份认证
- **Viper** - 配置管理

### 前端
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Zustand** - 状态管理

## 功能模块

### 系统管理模块 (sys/)
- ✅ 用户管理 - 用户CRUD、状态管理、角色分配
- ✅ 组织管理 - 树形组织结构、层级管理
- ✅ 角色管理 - 角色定义、权限分配
- ✅ 菜单管理 - 动态菜单、权限控制
- ✅ 字典管理 - 系统字典、数据字典项

### 认证模块 (auth/)
- ✅ 用户认证 - JWT令牌认证
- ✅ 权限控制 - 基于角色的访问控制
- ✅ 会话管理 - Redis会话存储

### 扩展模块
- 🔄 业务模块 - 可扩展的业务功能模块
- 🔄 报表模块 - 数据统计和报表
- 🔄 日志模块 - 操作日志和审计

## 项目结构

```
go-admin/
├── backend/                 # Go后端
│   ├── cmd/                # 应用入口
│   │   └── main.go
│   ├── internal/           # 内部包
│   │   ├── api/           # 认证API
│   │   │   └── auth.go
│   │   ├── config/        # 配置管理
│   │   │   └── config.go
│   │   ├── database/      # 数据库连接
│   │   │   └── database.go
│   │   ├── middleware/    # 中间件
│   │   │   ├── auth.go
│   │   │   ├── cache.go
│   │   │   ├── cors.go
│   │   │   └── middleware.go
│   │   ├── router/         # 路由配置
│   │   │   └── router.go
│   │   ├── service/        # 认证服务
│   │   │   └── auth.go
│   │   ├── sys/           # 系统管理模块
│   │   │   ├── api/       # 系统管理API
│   │   │   │   ├── dict.go
│   │   │   │   ├── menu.go
│   │   │   │   ├── organization.go
│   │   │   │   ├── role.go
│   │   │   │   └── user.go
│   │   │   ├── model/     # 系统管理数据模型
│   │   │   │   ├── dict.go
│   │   │   │   ├── menu.go
│   │   │   │   ├── organization.go
│   │   │   │   ├── role.go
│   │   │   │   └── user.go
│   │   │   └── service/    # 系统管理业务逻辑
│   │   │       ├── dict.go
│   │   │       ├── menu.go
│   │   │       ├── organization.go
│   │   │       ├── role.go
│   │   │       └── user.go
│   │   └── utils/         # 工具函数
│   │       ├── jwt.go
│   │       ├── password.go
│   │       └── snowflake.go
│   ├── scripts/           # 脚本文件
│   ├── uploads/           # 上传文件目录
│   ├── config.yaml        # 配置文件
│   ├── Dockerfile         # Docker配置
│   ├── go.mod
│   └── go.sum
├── frontend/              # React前端
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API服务
│   │   ├── store/         # 状态管理
│   │   ├── router/        # 路由配置
│   │   └── utils/         # 工具函数
│   └── package.json
├── config.yaml            # 项目配置文件
├── docker-compose.yml     # Docker配置
└── README.md
```

## 架构设计

### 模块化架构
项目采用模块化设计，每个功能模块都有独立的目录结构：

```
internal/
├── api/           # 认证相关API
├── service/        # 认证相关服务
├── sys/           # 系统管理模块
│   ├── api/       # 系统管理API
│   ├── model/     # 系统管理数据模型
│   └── service/   # 系统管理业务逻辑
├── middleware/    # 中间件
├── router/        # 路由配置
└── utils/         # 工具函数
```

### 设计原则
- **单一职责**: 每个模块负责特定的功能领域
- **低耦合**: 模块间通过接口交互，减少直接依赖
- **高内聚**: 相关功能集中在同一模块内
- **可扩展**: 新模块可以独立开发和部署

### 模块扩展
添加新模块时，只需在 `internal/` 下创建新的目录：

```
internal/
├── business/      # 业务模块
│   ├── api/
│   ├── model/
│   └── service/
├── finance/       # 财务模块
│   ├── api/
│   ├── model/
│   └── service/
└── report/        # 报表模块
    ├── api/
    ├── model/
    └── service/
```

## 快速开始

### 环境要求
- Go 1.21+
- Node.js 18+
- Docker & Docker Compose
- Git

### 配置文件

项目配置文件位于项目根目录的 `config.yaml`，包含以下配置项：

```yaml
server:
  port: "8080"        # 服务器端口
  mode: "debug"       # 运行模式

database:
  host: "localhost"   # 数据库主机
  port: 5432          # 数据库端口
  user: "postgres"    # 数据库用户名
  password: "password" # 数据库密码
  dbname: "go_admin"  # 数据库名称
  sslmode: "disable"  # SSL模式

redis:
  host: "localhost"   # Redis主机
  port: 6379         # Redis端口
  password: ""       # Redis密码
  db: 0             # Redis数据库

jwt:
  secret: "your-secret-key" # JWT密钥
  expire_time: 24           # 过期时间(小时)
```

**注意**: 请根据您的实际环境修改配置文件中的数据库和Redis连接信息。

### 一键启动（推荐）

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

### 手动启动

1. 启动数据库和Redis
```bash
docker-compose up -d postgres redis
```

2. 启动后端
```bash
cd backend
go mod tidy
go run cmd/main.go
```

3. 启动前端
```bash
cd frontend
npm install
npm start
```

### 使用Docker Compose启动所有服务

```bash
docker-compose up -d
```

### 访问地址

- **前端**: http://localhost:3000
- **后端API**: http://localhost:8080
- **数据库**: localhost:5432 (用户名: postgres, 密码: password)
- **Redis**: localhost:6379

### 默认账户

- 用户名: admin
- 密码: admin123

## 功能特性

### 核心模块
- ✅ **用户管理** - 用户CRUD、状态管理、角色分配
- ✅ **组织管理** - 树形组织结构、层级管理
- ✅ **角色管理** - 角色定义、权限分配
- ✅ **菜单管理** - 动态菜单、权限控制
- ✅ **字典管理** - 系统字典、数据字典项

### 技术特性
- 🔐 **JWT认证** - 安全的身份验证
- 🚀 **Redis缓存** - 高性能缓存机制
- 📊 **权限控制** - 基于角色的访问控制
- 🎨 **现代化UI** - Ant Design组件库
- 📱 **响应式设计** - 支持移动端
- 🐳 **Docker支持** - 容器化部署
