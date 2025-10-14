package api

import (
	"fmt"
	"net/http"
	"time"

	sysservice "siqian-admin/internal/sys/service"

	"github.com/gin-gonic/gin"
)

type AccessLogHandler struct {
	svc *sysservice.AccessLogService
}

func NewAccessLogHandler(svc *sysservice.AccessLogService) *AccessLogHandler {
	return &AccessLogHandler{svc: svc}
}

func (h *AccessLogHandler) List(c *gin.Context) {
	username := c.Query("username")
	path := c.Query("path")
	startStr := c.Query("start_time")
	endStr := c.Query("end_time")
	page := toIntDefault(c.Query("page"), 1)
	pageSize := toIntDefault(c.Query("page_size"), 10)

	var startTime *time.Time
	var endTime *time.Time
	if startStr != "" {
		if t, err := time.Parse(time.RFC3339, startStr); err == nil {
			startTime = &t
		}
	}
	if endStr != "" {
		if t, err := time.Parse(time.RFC3339, endStr); err == nil {
			endTime = &t
		}
	}

	res, err := h.svc.List(sysservice.ListAccessLogsParams{
		Username:  username,
		Path:      path,
		StartTime: startTime,
		EndTime:   endTime,
		Page:      page,
		PageSize:  pageSize,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *AccessLogHandler) BatchDelete(c *gin.Context) {
	var req struct {
		IDs []int64 `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.svc.BatchDelete(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func toIntDefault(s string, def int) int {
	if s == "" {
		return def
	}
	var v int
	if _, err := fmt.Sscanf(s, "%d", &v); err == nil {
		return v
	}
	return def
}
