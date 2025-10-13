package api

import (
	"go-admin/internal/sys/model"
	"go-admin/internal/sys/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	roleService *service.RoleService
}

func NewRoleHandler(roleService *service.RoleService) *RoleHandler {
	return &RoleHandler{roleService: roleService}
}

type CreateRoleRequest struct {
	Name        string `json:"name" binding:"required"`
	Code        string `json:"code" binding:"required"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Sort        int    `json:"sort"`
}

type UpdateRoleRequest struct {
	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Sort        int    `json:"sort"`
}

func (h *RoleHandler) CreateRole(c *gin.Context) {
	var req CreateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role := &model.Role{
		Name:        req.Name,
		Code:        req.Code,
		Description: req.Description,
		Status:      req.Status,
		Sort:        req.Sort,
	}

	if err := h.roleService.CreateRole(role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "角色创建成功", "role": role})
}

func (h *RoleHandler) GetRole(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID"})
		return
	}

	role, err := h.roleService.GetRoleByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "角色不存在"})
		return
	}

	c.JSON(http.StatusOK, role)
}

func (h *RoleHandler) UpdateRole(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID"})
		return
	}

	var req UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role, err := h.roleService.GetRoleByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "角色不存在"})
		return
	}

	role.Name = req.Name
	role.Code = req.Code
	role.Description = req.Description
	role.Status = req.Status
	role.Sort = req.Sort

	if err := h.roleService.UpdateRole(role); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "role": role})
}

func (h *RoleHandler) DeleteRole(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID"})
		return
	}

	if err := h.roleService.DeleteRole(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *RoleHandler) ListRoles(c *gin.Context) {
	roles, err := h.roleService.ListRoles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取角色列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"roles": roles})
}

func (h *RoleHandler) AssignMenus(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID"})
		return
	}

	var req struct {
		MenuIDs []string `json:"menu_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 将字符串ID转换为int64
	menuIDs := make([]int64, len(req.MenuIDs))
	for i, menuIDStr := range req.MenuIDs {
		menuID, err := strconv.ParseInt(menuIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的菜单ID: " + menuIDStr})
			return
		}
		menuIDs[i] = menuID
	}

	if err := h.roleService.AssignMenus(id, menuIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "分配菜单失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "菜单分配成功"})
}

func (h *RoleHandler) AssignUsers(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID"})
		return
	}

	var req struct {
		UserIDs []string `json:"user_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 将字符串ID转换为int64
	userIDs := make([]int64, len(req.UserIDs))
	for i, userIDStr := range req.UserIDs {
		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID: " + userIDStr})
			return
		}
		userIDs[i] = userID
	}

	if err := h.roleService.AssignUsers(id, userIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "分配用户失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "用户分配成功"})
}
