package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionService struct {
	rdb *redis.Client
}

func NewSessionService(rdb *redis.Client) *SessionService {
	return &SessionService{rdb: rdb}
}

type SessionData struct {
	UserID     uint      `json:"user_id"`
	Username   string    `json:"username"`
	LoginTime  time.Time `json:"login_time"`
	LastAccess time.Time `json:"last_access"`
	IPAddress  string    `json:"ip_address"`
	UserAgent  string    `json:"user_agent"`
}

// 创建会话
func (s *SessionService) CreateSession(ctx context.Context, sessionID string, data SessionData) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return s.rdb.Set(ctx, key, data, 24*time.Hour).Err()
}

// 获取会话
func (s *SessionService) GetSession(ctx context.Context, sessionID string) (*SessionData, error) {
	key := fmt.Sprintf("session:%s", sessionID)
	val, err := s.rdb.Get(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	var data SessionData
	if err := json.Unmarshal([]byte(val), &data); err != nil {
		return nil, err
	}

	return &data, nil
}

// 更新会话
func (s *SessionService) UpdateSession(ctx context.Context, sessionID string, data SessionData) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return s.rdb.Set(ctx, key, data, 24*time.Hour).Err()
}

// 删除会话
func (s *SessionService) DeleteSession(ctx context.Context, sessionID string) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return s.rdb.Del(ctx, key).Err()
}

// 延长会话过期时间
func (s *SessionService) ExtendSession(ctx context.Context, sessionID string) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return s.rdb.Expire(ctx, key, 24*time.Hour).Err()
}

// 获取用户的所有会话
func (s *SessionService) GetUserSessions(ctx context.Context, userID uint) ([]string, error) {
	pattern := fmt.Sprintf("session:*")
	keys, err := s.rdb.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, err
	}

	var userSessions []string
	for _, key := range keys {
		sessionData, err := s.GetSession(ctx, key[8:]) // 移除 "session:" 前缀
		if err != nil {
			continue
		}
		if sessionData.UserID == userID {
			userSessions = append(userSessions, key[8:])
		}
	}

	return userSessions, nil
}

// 删除用户的所有会话
func (s *SessionService) DeleteUserSessions(ctx context.Context, userID uint) error {
	sessions, err := s.GetUserSessions(ctx, userID)
	if err != nil {
		return err
	}

	for _, sessionID := range sessions {
		if err := s.DeleteSession(ctx, sessionID); err != nil {
			return err
		}
	}

	return nil
}
