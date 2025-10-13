package middleware

import (
	"fmt"
	"go-admin/internal/service"
	"go-admin/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取Authorization头
		authHeader := c.GetHeader("Authorization")
		fmt.Printf("认证调试 - 请求路径: %s, Authorization头: %s\n", c.Request.URL.Path, authHeader)

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供认证令牌"})
			c.Abort()
			return
		}

		// 检查Bearer前缀
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			fmt.Printf("认证调试 - 认证令牌格式错误: %s\n", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "认证令牌格式错误"})
			c.Abort()
			return
		}

		// 验证JWT令牌
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			fmt.Printf("认证调试 - 验证JWT令牌失败: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		fmt.Printf("认证调试 - 用户ID: %d, 用户名: %s\n", claims.UserID, claims.Username)
		// 将用户信息存储到上下文
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}

func PermissionMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未认证"})
			c.Abort()
			return
		}

		// 获取请求路径和方法
		path := c.Request.URL.Path
		method := c.Request.Method

		// 检查用户权限
		hasPermission, err := service.CheckUserPermission(userID.(int64), path, method)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "权限检查失败"})
			c.Abort()
			return
		}

		if !hasPermission {
			c.JSON(http.StatusForbidden, gin.H{"error": "权限不足"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// 基于 Redis 白名单的认证中间件：先查白名单键再校验 JWT
func AuthWhitelistMiddleware(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		fmt.Printf("认证调试 - 请求路径: %s, Authorization头: %s\n", c.Request.URL.Path, authHeader)

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供认证令牌"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			fmt.Printf("认证调试 - 认证令牌格式错误: %s\n", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "认证令牌格式错误"})
			c.Abort()
			return
		}

		// 先检查 Redis 白名单：jwt:whitelist:<token>
		whitelistKey := "jwt:whitelist:" + tokenString
		exists := rdb.Exists(c.Request.Context(), whitelistKey).Val()
		if exists == 0 {
			fmt.Printf("认证调试 - 令牌不在白名单: %s\n", tokenString)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未认证或会话失效"})
			c.Abort()
			return
		}

		// 再验证JWT令牌
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			fmt.Printf("认证调试 - 验证JWT令牌失败: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		fmt.Printf("认证调试 - 用户ID: %d, 用户名: %s\n", claims.UserID, claims.Username)
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}
