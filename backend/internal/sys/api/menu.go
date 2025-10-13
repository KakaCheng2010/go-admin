package api

import (
	"go-admin/internal/sys/model"
	"go-admin/internal/sys/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MenuHandler struct {
	menuService *service.MenuService
}

func NewMenuHandler(menuService *service.MenuService) *MenuHandler {
	return &MenuHandler{menuService: menuService}
}

type CreateMenuRequest struct {
	Name       string  `json:"name" binding:"required"`
	ParentID   *string `json:"parent_id"`
	Path       string  `json:"path"` // 将由服务层自动计算，前端可不传
	Component  string  `json:"component"`
	Icon       string  `json:"icon"`
	Type       int     `json:"type"`
	Sort       int     `json:"sort"`
	Status     string  `json:"status"`
	Permission string  `json:"permission"` // 权限标识
	Route      string  `json:"route"`      // 前端路由路径
	Hidden     bool    `json:"hidden"`     // 是否在菜单中隐藏
	KeepAlive  bool    `json:"keep_alive"` // 是否缓存页面
}

type UpdateMenuRequest struct {
	Name       string  `json:"name"`
	ParentID   *string `json:"parent_id"`
	Path       string  `json:"path"` // 将由服务层重新计算
	Component  string  `json:"component"`
	Icon       string  `json:"icon"`
	Type       int     `json:"type"`
	Sort       int     `json:"sort"`
	Status     string  `json:"status"`
	Permission string  `json:"permission"` // 权限标识
	Route      string  `json:"route"`      // 前端路由路径
	Hidden     bool    `json:"hidden"`     // 是否在菜单中隐藏
	KeepAlive  bool    `json:"keep_alive"` // 是否缓存页面
}

func (h *MenuHandler) CreateMenu(c *gin.Context) {
	var req CreateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var parentID *int64
	if req.ParentID != nil && *req.ParentID != "" {
		pid, err := strconv.ParseInt(*req.ParentID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "父级菜单ID格式错误"})
			return
		}
		parentID = &pid
	}

	menu := &model.Menu{
		Name:       req.Name,
		ParentID:   parentID,
		Path:       req.Path,
		Component:  req.Component,
		Icon:       req.Icon,
		Type:       req.Type,
		Sort:       req.Sort,
		Status:     req.Status,
		Permission: req.Permission,
		Route:      req.Route,
		Hidden:     req.Hidden,
		KeepAlive:  req.KeepAlive,
	}

	if err := h.menuService.CreateMenu(menu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "菜单创建成功", "menu": menu})
}

func (h *MenuHandler) GetMenu(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的菜单ID"})
		return
	}

	menu, err := h.menuService.GetMenuByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "菜单不存在"})
		return
	}

	c.JSON(http.StatusOK, menu)
}

func (h *MenuHandler) UpdateMenu(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的菜单ID"})
		return
	}

	var req UpdateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	menu, err := h.menuService.GetMenuByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "菜单不存在"})
		return
	}

	menu.Name = req.Name
	if req.ParentID != nil {
		if *req.ParentID == "" {
			menu.ParentID = nil
		} else {
			pid, perr := strconv.ParseInt(*req.ParentID, 10, 64)
			if perr != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "父级菜单ID格式错误"})
				return
			}
			menu.ParentID = &pid
		}
	}
	// 路径由服务层计算
	menu.Component = req.Component
	menu.Icon = req.Icon
	menu.Type = req.Type
	menu.Sort = req.Sort
	menu.Status = req.Status
	menu.Permission = req.Permission
	menu.Route = req.Route
	menu.Hidden = req.Hidden
	menu.KeepAlive = req.KeepAlive

	if err := h.menuService.UpdateMenu(menu); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "menu": menu})
}

func (h *MenuHandler) DeleteMenu(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的菜单ID"})
		return
	}

	if err := h.menuService.DeleteMenu(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *MenuHandler) ListMenus(c *gin.Context) {
	menus, err := h.menuService.ListMenus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取菜单列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menus": menus})
}

func (h *MenuHandler) GetMenuTree(c *gin.Context) {
	menus, err := h.menuService.GetMenuTree()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取菜单树失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menus": menus})
}

// GetUserMenus 获取当前用户的菜单
func (h *MenuHandler) GetUserMenus(c *gin.Context) {
	// 从JWT中获取用户ID
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未找到用户信息"})
		return
	}

	userIDInt, ok := userID.(int64)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户ID格式错误"})
		return
	}

	menus, err := h.menuService.GetUserMenus(userIDInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取用户菜单失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menus": menus})
}
