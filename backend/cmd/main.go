package main

import (
	"go-admin/internal/config"
	"go-admin/internal/database"
	"go-admin/internal/middleware"
	"go-admin/internal/router"
	"log"
)

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库连接
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}

	// 初始化Redis连接
	rdb, err := database.InitRedis(cfg)
	if err != nil {
		log.Fatal("Redis连接失败:", err)
	}

	// 创建路由
	r := router.SetupRouter(cfg, db, rdb)

	// 添加中间件
	middleware.SetupMiddleware(r, cfg)

	// 启动服务器
	log.Printf("服务器启动在端口 %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}
