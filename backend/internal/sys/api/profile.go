package api

import (
	"net/http"
	"siqian-admin/internal/config"
	"siqian-admin/internal/sys/service"
	"siqian-admin/internal/utils"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type ProfileHandler struct {
	userService *service.UserService
}

func NewProfileHandler(userService *service.UserService) *ProfileHandler {
	return &ProfileHandler{userService: userService}
}

type UpdateProfileRequest struct {
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	RealName string `json:"real_name"`
	Avatar   string `json:"avatar"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

// GetProfile 获取当前用户资料
func (h *ProfileHandler) GetProfile(c *gin.Context) {
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

	user, err := h.userService.GetUserByID(userIDInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	// 返回用户资料（不包含密码）
	c.JSON(http.StatusOK, user)
}

// UpdateProfile 更新用户资料
func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
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

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.GetUserByID(userIDInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	// 更新用户信息
	user.Phone = req.Phone
	user.RealName = req.RealName

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

	// 重新查询用户信息，确保返回最新数据
	updatedUser, err := h.userService.GetUserByID(userIDInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取更新后的用户信息失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "资料更新成功",
		"user":    updatedUser,
	})
}

// ChangePassword 修改密码
func (h *ProfileHandler) ChangePassword(c *gin.Context) {
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

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.GetUserByID(userIDInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	// 验证旧密码
	if !utils.CheckPasswordHash(req.OldPassword, user.Password) {
		c.JSON(http.StatusOK, gin.H{
			"code":    400,
			"success": false,
			"message": "原密码错误",
		})
		return
	}

	// 加密新密码
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    500,
			"success": false,
			"message": "密码加密失败",
		})
		return
	}

	user.Password = hashedPassword
	if err := h.userService.UpdateUser(user); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"code":    500,
			"success": false,
			"message": "密码修改失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"success": true,
		"message": "密码修改成功",
	})
}

// UploadAvatar 上传头像
func (h *ProfileHandler) UploadAvatar(c *gin.Context) {
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

	// 获取上传的文件
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请选择头像文件"})
		return
	}

	// 获取配置
	cfg := config.GetConfig()

	// 验证文件类型
	allowedTypes := make(map[string]bool)
	for _, t := range cfg.Upload.AllowedTypes {
		allowedTypes[t] = true
	}
	if !allowedTypes[file.Header.Get("Content-Type")] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不支持的文件类型"})
		return
	}

	// 验证文件大小
	if file.Size > cfg.Upload.MaxSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "头像文件大小超过限制"})
		return
	}

	// 生成文件名，使用原始文件的后缀
	originalFilename := file.Filename
	fileExt := ""
	if lastDot := strings.LastIndex(originalFilename, "."); lastDot != -1 {
		fileExt = originalFilename[lastDot:] // 包含点号的后缀
	}

	fileName := "avatar_" + strconv.FormatInt(userIDInt, 10) + "_" + strconv.FormatInt(utils.GenerateID(), 10) + fileExt

	// 保存文件
	uploadPath := cfg.Upload.AvatarPath
	if err := c.SaveUploadedFile(file, uploadPath+fileName); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "头像上传失败"})
		return
	}

	// 更新用户头像路径
	user, err := h.userService.GetUserByID(userIDInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		return
	}

	// 保存相对路径到数据库
	user.Avatar = "/" + uploadPath + fileName
	if err := h.userService.UpdateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "头像更新失败"})
		return
	}

	// 返回完整的访问URL
	avatarURL := "/uploads/avatars/" + fileName
	c.JSON(http.StatusOK, gin.H{
		"message": "头像上传成功",
		"avatar":  avatarURL,
	})
}
