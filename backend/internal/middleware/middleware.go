package middleware

import (
	"go-admin/internal/config"

	"github.com/gin-gonic/gin"
)

func SetupMiddleware(r *gin.Engine, cfg *config.Config) {
	// CORS中间件
	r.Use(CORSMiddleware())

	// 日志中间件
	r.Use(gin.Logger())

	// 恢复中间件
	r.Use(gin.Recovery())

	// 设置Gin模式
	gin.SetMode(cfg.Server.Mode)
}
