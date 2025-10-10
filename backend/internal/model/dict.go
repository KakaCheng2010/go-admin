package model

import (
	"time"

	"gorm.io/gorm"
)

type Dict struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null" binding:"required"`
	Code        string         `json:"code" gorm:"uniqueIndex;not null" binding:"required"`
	Description string         `json:"description"`
	Status      int            `json:"status" gorm:"default:1"` // 1:正常 0:禁用
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系
	Items []DictItem `json:"items" gorm:"foreignKey:DictID"`
}

type DictItem struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	DictID    uint           `json:"dict_id" gorm:"not null"`
	Label     string         `json:"label" gorm:"not null" binding:"required"`
	Value     string         `json:"value" gorm:"not null" binding:"required"`
	Sort      int            `json:"sort" gorm:"default:0"`
	Status    int            `json:"status" gorm:"default:1"` // 1:正常 0:禁用
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联关系
	Dict Dict `json:"dict" gorm:"foreignKey:DictID"`
}
