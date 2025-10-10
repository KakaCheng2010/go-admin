package model

import (
	"time"

	"gorm.io/gorm"
)

type Role struct {
	ID          int64          `json:"id,string" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null" binding:"required"`
	Code        string         `json:"code" gorm:"uniqueIndex;not null" binding:"required"`
	Description string         `json:"description"`
	Status      int            `json:"status" gorm:"default:1"` // 1:正常 0:禁用
	Sort        int            `json:"sort" gorm:"default:0"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系
	Users []User `json:"users" gorm:"many2many:user_roles;"`
	Menus []Menu `json:"menus" gorm:"many2many:role_menus;"`
}

type RoleMenu struct {
	RoleID int64 `json:"role_id,string" gorm:"primaryKey"`
	MenuID int64 `json:"menu_id,string" gorm:"primaryKey"`
}
