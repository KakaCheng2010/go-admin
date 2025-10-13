package model

import (
	"time"

	"gorm.io/gorm"
)

type Menu struct {
	ID         int64          `json:"id,string" gorm:"primaryKey"`
	Name       string         `json:"name" gorm:"not null" binding:"required"`
	ParentID   *int64         `json:"parent_id,string"`
	Path       string         `json:"path"`
	Component  string         `json:"component"`
	Icon       string         `json:"icon"`
	Type       int            `json:"type" gorm:"default:1"` // 1:菜单 2:按钮
	Sort       int            `json:"sort" gorm:"default:0"`
	Status     string         `json:"status" gorm:"default:'1'"` // 1:正常 0:禁用
	Permission string         `json:"permission"`                // 权限标识
	Route      string         `json:"route"`                     // 前端路由路径
	Hidden     bool           `json:"hidden"`                    // 是否在菜单中隐藏
	KeepAlive  bool           `json:"keep_alive"`                // 是否缓存页面
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系
	Parent   *Menu  `json:"parent" gorm:"foreignKey:ParentID"`
	Children []Menu `json:"children" gorm:"foreignKey:ParentID"`
	Roles    []Role `json:"roles" gorm:"many2many:sys_role_menus;"`
}

// TableName 指定表名
func (Menu) TableName() string {
	return "sys_menus"
}
