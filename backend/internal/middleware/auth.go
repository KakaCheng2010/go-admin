package middleware

import (
	"fmt"
	"go-admin/internal/config"
	"go-admin/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

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

		// 令牌临期自动续期
		cfg := config.GetConfig()
		if ttl, err := utils.RemainingTTL(tokenString); err == nil {
			if int(ttl.Seconds()) <= cfg.JWT.RefreshAheadSeconds {
				if newToken, err := utils.GenerateJWT(claims.UserID, claims.Username, cfg); err == nil {
					// 刷新白名单：写入新 token，删除旧 token
					if rdb != nil {
						if newTTL, err := utils.RemainingTTL(newToken); err == nil {
							newKey := "jwt:whitelist:" + newToken
							_ = rdb.Set(c.Request.Context(), newKey, "1", newTTL).Err()
							_ = rdb.Del(c.Request.Context(), whitelistKey).Err()
						}
					}
					// 通过响应头下发新 token
					c.Writer.Header().Set("X-Refresh-Token", newToken)
				}
			}
		}

		c.Next()
	}
}
