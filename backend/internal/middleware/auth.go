package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"siqian-admin/internal/config"
	"siqian-admin/internal/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func AuthMiddleware(rdb *redis.Client, permissions []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 允许不配置：无权限要求时直接放行
		if len(permissions) == 0 {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供认证令牌"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "认证令牌格式错误"})
			c.Abort()
			return
		}

		sessionJSON, gErr := rdb.Get(c.Request.Context(), "jwt:whitelist:"+tokenString).Result()
		if gErr != nil || sessionJSON == "" {
			fmt.Printf("权限校验 - 会话不存在或读取失败: %v\n", gErr)
			c.JSON(http.StatusForbidden, gin.H{"error": "无权限或会话失效"})
			c.Abort()
			return
		}

		// 解析 menus
		type menuLite struct {
			Permission string     `json:"permission"`
			Children   []menuLite `json:"children"`
		}
		var session struct {
			Menus []menuLite `json:"menus"`
		}
		if uErr := json.Unmarshal([]byte(sessionJSON), &session); uErr != nil {
			fmt.Printf("权限校验 - 解析会话失败: %v\n", uErr)
			c.JSON(http.StatusForbidden, gin.H{"error": "无权限或会话异常"})
			c.Abort()
			return
		}

		// 收集用户权限集合
		userPerms := map[string]struct{}{}
		var walk func(items []menuLite)
		walk = func(items []menuLite) {
			for _, m := range items {
				if p := strings.TrimSpace(m.Permission); p != "" {
					userPerms[p] = struct{}{}
				}
				if len(m.Children) > 0 {
					walk(m.Children)
				}
			}
		}
		walk(session.Menus)

		// 求交集：菜单权限 与 传入 permissions
		allowed := false
		for _, need := range permissions {
			if _, ok := userPerms[need]; ok {
				allowed = true
				break
			}
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"error":       "无权限访问",
				"permissions": permissions,
			})
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
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

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
					// 刷新白名单 + 会话：迁移旧 token 的信息到新 token
					if rdb != nil {
						if newTTL, err := utils.RemainingTTL(newToken); err == nil {
							// 迁移会话：读取旧会话 JSON，写入新 token，并删旧会话
							if sessionJSON, gErr := rdb.Get(c.Request.Context(), "jwt:whitelist:"+tokenString).Result(); gErr == nil {
								_ = rdb.Set(c.Request.Context(), "jwt:whitelist:"+newToken, sessionJSON, newTTL).Err()
								_ = rdb.Del(c.Request.Context(), "jwt:whitelist:"+tokenString).Err()
							}
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
