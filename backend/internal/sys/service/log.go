package service

import (
	"time"

	"go-admin/internal/sys/model"

	"gorm.io/gorm"
)

type AccessLogService struct {
	db *gorm.DB
}

func NewAccessLogService(db *gorm.DB) *AccessLogService {
	return &AccessLogService{db: db}
}

type ListAccessLogsParams struct {
	Username  string
	Path      string
	StartTime *time.Time
	EndTime   *time.Time
	Page      int
	PageSize  int
}

type PagedAccessLogs struct {
	Total int64             `json:"total"`
	Items []model.AccessLog `json:"items"`
}

func (s *AccessLogService) List(params ListAccessLogsParams) (PagedAccessLogs, error) {
	if params.Page <= 0 {
		params.Page = 1
	}
	if params.PageSize <= 0 || params.PageSize > 200 {
		params.PageSize = 10
	}

	q := s.db.Model(&model.AccessLog{})

	if params.Username != "" {
		q = q.Where("username ILIKE ?", "%"+params.Username+"%")
	}
	if params.Path != "" {
		q = q.Where("path ILIKE ?", "%"+params.Path+"%")
	}
	if params.StartTime != nil {
		q = q.Where("created_at >= ?", *params.StartTime)
	}
	if params.EndTime != nil {
		q = q.Where("created_at <= ?", *params.EndTime)
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return PagedAccessLogs{}, err
	}

	var items []model.AccessLog
	if err := q.Order("created_at DESC").Offset((params.Page - 1) * params.PageSize).Limit(params.PageSize).Find(&items).Error; err != nil {
		return PagedAccessLogs{}, err
	}

	return PagedAccessLogs{Total: total, Items: items}, nil
}

func (s *AccessLogService) BatchDelete(ids []int64) error {
	if len(ids) == 0 {
		return nil
	}
	return s.db.Where("id IN ?", ids).Delete(&model.AccessLog{}).Error
}
