package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheService struct {
	rdb *redis.Client
}

func NewCacheService(rdb *redis.Client) *CacheService {
	return &CacheService{rdb: rdb}
}

// 设置缓存
func (s *CacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return s.rdb.Set(ctx, key, data, expiration).Err()
}

// 获取缓存
func (s *CacheService) Get(ctx context.Context, key string, dest interface{}) error {
	val, err := s.rdb.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(val), dest)
}

// 删除缓存
func (s *CacheService) Delete(ctx context.Context, key string) error {
	return s.rdb.Del(ctx, key).Err()
}

// 检查键是否存在
func (s *CacheService) Exists(ctx context.Context, key string) (bool, error) {
	result, err := s.rdb.Exists(ctx, key).Result()
	return result > 0, err
}

// 设置用户会话
func (s *CacheService) SetUserSession(ctx context.Context, userID uint, sessionData map[string]interface{}) error {
	key := fmt.Sprintf("user:session:%d", userID)
	return s.Set(ctx, key, sessionData, 24*time.Hour)
}

// 获取用户会话
func (s *CacheService) GetUserSession(ctx context.Context, userID uint) (map[string]interface{}, error) {
	key := fmt.Sprintf("user:session:%d", userID)
	var sessionData map[string]interface{}
	err := s.Get(ctx, key, &sessionData)
	return sessionData, err
}

// 删除用户会话
func (s *CacheService) DeleteUserSession(ctx context.Context, userID uint) error {
	key := fmt.Sprintf("user:session:%d", userID)
	return s.Delete(ctx, key)
}

// 设置用户权限缓存
func (s *CacheService) SetUserPermissions(ctx context.Context, userID uint, permissions []string) error {
	key := fmt.Sprintf("user:permissions:%d", userID)
	return s.Set(ctx, key, permissions, 1*time.Hour)
}

// 获取用户权限缓存
func (s *CacheService) GetUserPermissions(ctx context.Context, userID uint) ([]string, error) {
	key := fmt.Sprintf("user:permissions:%d", userID)
	var permissions []string
	err := s.Get(ctx, key, &permissions)
	return permissions, err
}

// 缓存菜单树
func (s *CacheService) SetMenuTree(ctx context.Context, userID uint, menuTree interface{}) error {
	key := fmt.Sprintf("user:menu:%d", userID)
	return s.Set(ctx, key, menuTree, 1*time.Hour)
}

// 获取菜单树缓存
func (s *CacheService) GetMenuTree(ctx context.Context, userID uint, dest interface{}) error {
	key := fmt.Sprintf("user:menu:%d", userID)
	return s.Get(ctx, key, dest)
}
