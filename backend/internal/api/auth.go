package api

import (
	"fmt"
	"go-admin/internal/config"
	"go-admin/internal/service"
	"go-admin/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type AuthHandler struct {
	authService *service.AuthService
	rdb         *redis.Client
}

func NewAuthHandler(authService *service.AuthService, rdb *redis.Client) *AuthHandler {
	return &AuthHandler{authService: authService, rdb: rdb}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// 生成JWT令牌
	cfg := config.GetConfig()
	token, err := utils.GenerateJWT(user.ID, user.Username, cfg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "令牌生成失败"})
		return
	}

	// 将 token 写入 Redis 白名单，TTL 与 token 剩余有效期对齐
	if h.rdb != nil {
		if ttl, err := utils.RemainingTTL(token); err == nil {
			key := "jwt:whitelist:" + token
			if err := h.rdb.Set(c.Request.Context(), key, "1", ttl).Err(); err != nil {
				// 仅记录，不阻断登录
				fmt.Printf("登录白名单写入失败: %v\n", err)
			}
		} else {
			fmt.Printf("计算 token TTL 失败: %v\n", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":        user.ID,
			"username":  user.Username,
			"email":     user.Email,
			"real_name": user.RealName,
			"avatar":    user.Avatar,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// 从 Authorization 头提取 token 并从白名单移除
	authHeader := c.GetHeader("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == "" || tokenString == authHeader {
		c.JSON(http.StatusBadRequest, gin.H{"error": "未提供有效令牌"})
		return
	}
	if h.rdb != nil {
		key := "jwt:whitelist:" + tokenString
		if err := h.rdb.Del(c.Request.Context(), key).Err(); err != nil {
			fmt.Printf("退出白名单删除失败: %v\n", err)
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "退出成功"})
}
