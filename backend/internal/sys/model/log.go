package model

import (
	"time"
)

// AccessLog 记录每次请求的关键审计信息
type AccessLog struct {
	ID         int64     `json:"id,string" gorm:"primaryKey"`
	Username   string    `json:"username" gorm:"index;size:128"`
	Path       string    `json:"path" gorm:"index;size:512"`
	Method     string    `json:"method" gorm:"size:16"`
	IP         string    `json:"ip" gorm:"size:64"`
	StatusCode int       `json:"status_code" gorm:"index"`
	UserAgent  string    `json:"user_agent" gorm:"size:512"`
	LatencyMs  int64     `json:"latency_ms"`
	CreatedAt  time.Time `json:"created_at"`
}

func (AccessLog) TableName() string {
	return "sys_access_logs"
}
