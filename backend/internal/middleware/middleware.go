package middleware

import (
	"context"
	"fmt"
	"strings"
	"time"

	"go-admin/internal/config"
	"go-admin/internal/sys/model"
	"go-admin/internal/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupMiddleware(r *gin.Engine, cfg *config.Config) {
	// CORS中间件
	r.Use(CORSMiddleware())

	// 日志中间件（控制台）
	r.Use(gin.Logger())

	// 恢复中间件
	r.Use(gin.Recovery())

	// 设置Gin模式
	gin.SetMode(cfg.Server.Mode)
}

// RequestLogMiddleware 记录访问日志到数据库
func RequestLogMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// 预取关键信息
		path := c.Request.URL.Path
		method := c.Request.Method
		ip := c.ClientIP()
		ua := c.Request.UserAgent()
		// 优先通过 token 解析用户名，失败再回退到 context
		username := ""
		if authHeader := c.GetHeader("Authorization"); authHeader != "" {
			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token != authHeader {
				if claims, err := utils.ValidateJWT(token); err == nil {
					username = claims.Username
				}
			}
		}
		if username == "" {
			if v, ok := c.Get("username"); ok {
				if u, ok2 := v.(string); ok2 {
					username = u
				}
			}
		}

		c.Next()

		duration := time.Since(start)
		status := c.Writer.Status()

		// 跳过 GET 请求的日志
		if method == "GET" {
			return
		}

		// 写数据库（异步，避免阻塞请求）
		go func() {
			log := model.AccessLog{
				Username:   username,
				Path:       path,
				Method:     method,
				IP:         ip,
				StatusCode: status,
				UserAgent:  ua,
				LatencyMs:  duration.Milliseconds(),
				CreatedAt:  time.Now(),
			}
			if db != nil {
				if err := db.WithContext(context.Background()).Create(&log).Error; err != nil {
					// 控制台输出错误，便于排查
					fmt.Printf("访问日志写入失败: %v\n", err)
				}
			}
		}()
	}
}
