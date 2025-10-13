package model

import (
	"time"

	"gorm.io/gorm"
)

type Organization struct {
	ID          int64          `json:"id,string" gorm:"primaryKey;autoIncrement:false"`
	Name        string         `json:"name" gorm:"not null" binding:"required"`
	Code        string         `json:"code" gorm:"uniqueIndex;not null" binding:"required"`
	ParentID    *int64         `json:"parent_id,string"`
	Path        string         `json:"path" gorm:"index"` // 路径，形如 1/2/3/4
	Sort        int            `json:"sort" gorm:"default:0"`
	Status      string         `json:"status" gorm:"default:'1'"` // 1:正常 0:禁用
	Description string         `json:"description"`
	CreatedBy   int64          `json:"created_by,string" gorm:"index"`
	UpdatedBy   int64          `json:"updated_by,string" gorm:"index"`
	DeletedBy   *int64         `json:"deleted_by,string" gorm:"index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系（不使用外键约束）
	Parent   *Organization  `json:"parent" gorm:"foreignKey:ParentID"`
	Children []Organization `json:"children" gorm:"foreignKey:ParentID"`
	Users    []User         `json:"users" gorm:"many2many:sys_user_organizations;"`
}

// TableName 指定表名
func (Organization) TableName() string {
	return "sys_organizations"
}
