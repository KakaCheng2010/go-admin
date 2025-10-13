package api

import (
	"go-admin/internal/sys/model"
	"go-admin/internal/sys/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

type CreateUserRequest struct {
	Username       string `json:"username" binding:"required"`
	Password       string `json:"password" binding:"required"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	RealName       string `json:"real_name"`
	OrganizationID string `json:"organization_id"`
	Status         string `json:"status"`
}

type UpdateUserRequest struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	RealName string `json:"real_name"`
	Status   string `json:"status"`
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 操作人
	operatorID, _ := c.Get("user_id")

	user := &model.User{
		Username:  req.Username,
		Password:  req.Password,
		Phone:     req.Phone,
		RealName:  req.RealName,
		Status:    req.Status,
		CreatedBy: operatorID.(int64),
		UpdatedBy: operatorID.(int64),
	}

	// 只有当邮箱不为空时才设置
	if req.Email != "" {
		user.Email = &req.Email
	}

	if err := h.userService.CreateUser(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 如果提供了组织ID，则关联用户到组织
	if req.OrganizationID != "" {
		orgID, err := strconv.ParseInt(req.OrganizationID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的组织ID"})
			return
		}

		if err := h.userService.AssignOrganizations(user.ID, []int64{orgID}); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "关联组织失败"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "用户创建成功", "user": user})
}

func (h *UserHandler) GetUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID"})
		return
	}

	user, err := h.userService.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	// 操作人
	operatorID, _ := c.Get("user_id")

	user.Phone = req.Phone
	user.RealName = req.RealName
	user.Status = req.Status
	user.UpdatedBy = operatorID.(int64)

	// 只有当邮箱不为空时才更新
	if req.Email != "" {
		user.Email = &req.Email
	} else {
		user.Email = nil
	}

	if err := h.userService.UpdateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "user": user})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID"})
		return
	}

	// 操作人
	operatorID, _ := c.Get("user_id")

	if err := h.userService.SoftDeleteUser(id, operatorID.(int64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *UserHandler) BatchDeleteUsers(c *gin.Context) {
	var req struct {
		IDs []string `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	// 转换字符串ID为int64
	var ids []int64
	for _, idStr := range req.IDs {
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID: " + idStr})
			return
		}
		ids = append(ids, id)
	}

	// 批量删除用户
	for _, id := range ids {
		if err := h.userService.DeleteUser(id); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "删除用户失败"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "批量删除成功"})
}

func (h *UserHandler) ListUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	organizationID := c.Query("organization_id")     // 组织ID参数
	organizationPath := c.Query("organization_path") // 组织路径参数
	username := c.Query("username")                  // 用户名（模糊）
	phone := c.Query("phone")                        // 手机号（模糊）
	statusStr := c.Query("status")                   // 状态（精确）

	var filters *service.UserFilters
	if username != "" || phone != "" || statusStr != "" {
		filters = &service.UserFilters{}
		if username != "" {
			filters.Username = username
		}
		if phone != "" {
			filters.Phone = phone
		}
		if statusStr != "" {
			filters.Status = &statusStr
		}
	}

	var users []model.User
	var total int64
	var err error

	if organizationPath != "" {
		// 按组织路径查询用户（包含子组织）
		users, total, err = h.userService.ListUsersByOrganizationPath(organizationPath, page, pageSize, filters)
	} else if organizationID != "" {
		// 按组织ID查询用户（仅当前组织）
		orgID, parseErr := strconv.ParseInt(organizationID, 10, 64)
		if parseErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的组织ID"})
			return
		}
		// ListUsersByOrganization 暂不支持 filters，保持原行为
		users, total, err = h.userService.ListUsersByOrganization(orgID, page, pageSize)
	} else {
		// 查询所有用户
		users, total, err = h.userService.ListUsers(page, pageSize, filters)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取用户列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users":     users,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

func (h *UserHandler) AssignRoles(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的用户ID"})
		return
	}

	var req struct {
		RoleIDs []string `json:"role_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 将字符串ID转换为int64
	roleIDs := make([]int64, len(req.RoleIDs))
	for i, roleIDStr := range req.RoleIDs {
		roleID, err := strconv.ParseInt(roleIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的角色ID: " + roleIDStr})
			return
		}
		roleIDs[i] = roleID
	}

	if err := h.userService.AssignRoles(id, roleIDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "分配角色失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "角色分配成功"})
}
