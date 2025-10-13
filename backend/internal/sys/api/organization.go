package api

import (
	"fmt"
	"go-admin/internal/sys/model"
	"go-admin/internal/sys/service"
	"go-admin/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type OrganizationHandler struct {
	orgService *service.OrganizationService
}

func NewOrganizationHandler(orgService *service.OrganizationService) *OrganizationHandler {
	return &OrganizationHandler{orgService: orgService}
}

type CreateOrganizationRequest struct {
	Name        string  `json:"name" binding:"required"`
	Code        string  `json:"code" binding:"required"`
	ParentID    *string `json:"parent_id"`
	Sort        int     `json:"sort"`
	Status      string  `json:"status"`
	Description string  `json:"description"`
}

type UpdateOrganizationRequest struct {
	Name        string  `json:"name"`
	Code        string  `json:"code"`
	ParentID    *string `json:"parent_id"`
	Sort        int     `json:"sort"`
	Status      string  `json:"status"`
	Description string  `json:"description"`
}

func (h *OrganizationHandler) CreateOrganization(c *gin.Context) {
	var req CreateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 生成雪花ID
	id := utils.GenerateID()

	// 处理父组织ID和路径
	var parentID *int64
	var path string
	if req.ParentID != nil && *req.ParentID != "" {
		// 将字符串ID转换为int64
		parentIDInt, err := strconv.ParseInt(*req.ParentID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "父组织ID格式错误"})
			return
		}
		parentID = &parentIDInt

		// 获取父组织的路径
		parentOrg, err := h.orgService.GetOrganizationByID(parentIDInt)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "父组织不存在，请检查父组织ID是否正确"})
			return
		}
		path = parentOrg.Path + "/" + strconv.FormatInt(id, 10)
	} else {
		path = strconv.FormatInt(id, 10)
	}

	operatorID, _ := c.Get("user_id")

	org := &model.Organization{
		ID:          id,
		Name:        req.Name,
		Code:        req.Code,
		ParentID:    parentID,
		Path:        path,
		Sort:        req.Sort,
		Status:      req.Status,
		Description: req.Description,
		CreatedBy:   operatorID.(int64),
		UpdatedBy:   operatorID.(int64),
	}

	if err := h.orgService.CreateOrganization(org); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "组织创建成功", "organization": org})
}

func (h *OrganizationHandler) GetOrganization(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的组织ID"})
		return
	}

	org, err := h.orgService.GetOrganizationByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "组织不存在"})
		return
	}

	c.JSON(http.StatusOK, org)
}

func (h *OrganizationHandler) UpdateOrganization(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的组织ID"})
		return
	}

	var req UpdateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	org, err := h.orgService.GetOrganizationByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "组织不存在"})
		return
	}

	// 如果父组织发生变化，需要重新计算路径
	var newPath string
	var newParentID *int64
	if req.ParentID != nil && *req.ParentID != "" {
		// 将字符串ID转换为int64
		parentIDInt, err := strconv.ParseInt(*req.ParentID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "父组织ID格式错误"})
			return
		}
		newParentID = &parentIDInt

		parentOrg, err := h.orgService.GetOrganizationByID(parentIDInt)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "父组织不存在"})
			return
		}
		newPath = parentOrg.Path + "/" + strconv.FormatInt(id, 10)
	} else {
		newParentID = nil
		newPath = strconv.FormatInt(id, 10)
	}

	org.Name = req.Name
	org.Code = req.Code
	org.ParentID = newParentID
	org.Path = newPath
	org.Sort = req.Sort
	org.Status = req.Status
	org.Description = req.Description

	// 调试日志
	fmt.Printf("更新组织 ID=%d, ParentID=%v, Path=%s\n", org.ID, org.ParentID, org.Path)
	// 设置操作人
	if operatorID, ok := c.Get("user_id"); ok {
		org.UpdatedBy = operatorID.(int64)
	}

	if err := h.orgService.UpdateOrganization(org); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "organization": org})
}

func (h *OrganizationHandler) DeleteOrganization(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的组织ID"})
		return
	}

	if operatorID, ok := c.Get("user_id"); ok {
		if err := h.orgService.SoftDeleteOrganization(id, operatorID.(int64)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
		return
	}
	if err := h.orgService.DeleteOrganization(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *OrganizationHandler) ListOrganizations(c *gin.Context) {
	orgs, err := h.orgService.ListOrganizations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取组织列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"organizations": orgs})
}

func (h *OrganizationHandler) GetOrganizationTree(c *gin.Context) {
	orgs, err := h.orgService.GetOrganizationTree()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取组织树失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"organizations": orgs})
}
