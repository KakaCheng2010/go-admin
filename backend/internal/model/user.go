package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID          int64          `json:"id,string" gorm:"primaryKey"`
	Username    string         `json:"username" gorm:"uniqueIndex;not null" binding:"required"`
	Password    string         `json:"-" gorm:"not null" binding:"required"`
	Email       *string        `json:"email" gorm:"uniqueIndex"`
	Phone       string         `json:"phone"`
	RealName    string         `json:"real_name"`
	Avatar      string         `json:"avatar"`
	Status      int            `json:"status" gorm:"default:1"` // 1:正常 0:禁用
	LastLoginAt *time.Time     `json:"last_login_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系
	Organizations []Organization `json:"organizations" gorm:"many2many:user_organizations;"`
	Roles         []Role         `json:"roles" gorm:"many2many:user_roles;"`
}

type UserRole struct {
	UserID int64 `json:"user_id,string" gorm:"primaryKey"`
	RoleID int64 `json:"role_id,string" gorm:"primaryKey"`
}

type UserOrganization struct {
	UserID         int64 `json:"user_id,string" gorm:"primaryKey"`
	OrganizationID int64 `json:"organization_id,string" gorm:"primaryKey"`
}
