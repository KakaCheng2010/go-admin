package api

import (
	"go-admin/internal/model"
	"go-admin/internal/service"
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
	Name      string  `json:"name" binding:"required"`
	Code      string  `json:"code" binding:"required"`
	ParentID  *string `json:"parent_id"`
	Path      string  `json:"path"` // 将由服务层自动计算，前端可不传
	Component string  `json:"component"`
	Icon      string  `json:"icon"`
	Type      int     `json:"type"`
	Sort      int     `json:"sort"`
	Status    int     `json:"status"`
}

type UpdateMenuRequest struct {
	Name      string  `json:"name"`
	Code      string  `json:"code"`
	ParentID  *string `json:"parent_id"`
	Path      string  `json:"path"` // 将由服务层重新计算
	Component string  `json:"component"`
	Icon      string  `json:"icon"`
	Type      int     `json:"type"`
	Sort      int     `json:"sort"`
	Status    int     `json:"status"`
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
		Name:      req.Name,
		Code:      req.Code,
		ParentID:  parentID,
		Path:      req.Path,
		Component: req.Component,
		Icon:      req.Icon,
		Type:      req.Type,
		Sort:      req.Sort,
		Status:    req.Status,
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
	menu.Code = req.Code
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
