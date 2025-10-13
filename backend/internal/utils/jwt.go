package utils

import (
	"errors"
	"go-admin/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   int64  `json:"user_id"`
	Username string `json:"username"`
	// 可选：在JWT中内嵌简化的菜单列表，便于前端快速恢复（不强依赖）
	Menus any `json:"menus,omitempty"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID int64, username string, cfg *config.Config) (string, error) {
	claims := Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(cfg.JWT.ExpireTime) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWT.Secret))
}

func ValidateJWT(tokenString string) (*Claims, error) {
	// 从全局配置中获取JWT密钥
	cfg := config.GetConfig()
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.JWT.Secret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token invalid")
	}

	return claims, nil
}

// 计算给定 token 剩余有效期，用于对齐 Redis TTL
func RemainingTTL(tokenString string) (time.Duration, error) {
	cfg := config.GetConfig()
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.JWT.Secret), nil
	})
	if err != nil {
		return 0, err
	}
	if !token.Valid {
		return 0, errors.New("token invalid")
	}
	if claims.ExpiresAt == nil {
		return 0, errors.New("token has no exp")
	}
	ttl := time.Until(claims.ExpiresAt.Time)
	if ttl < 0 {
		return 0, errors.New("token expired")
	}
	return ttl, nil
}
