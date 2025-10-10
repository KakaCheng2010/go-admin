package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Username    string         `json:"username" gorm:"uniqueIndex;not null" binding:"required"`
	Password    string         `json:"-" gorm:"not null" binding:"required"`
	Email       string         `json:"email" gorm:"uniqueIndex"`
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
	UserID uint `json:"user_id" gorm:"primaryKey"`
	RoleID uint `json:"role_id" gorm:"primaryKey"`
}

type UserOrganization struct {
	UserID         uint `json:"user_id" gorm:"primaryKey"`
	OrganizationID uint `json:"organization_id" gorm:"primaryKey"`
}
