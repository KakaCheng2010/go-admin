package service

import (
	"errors"
	"go-admin/internal/sys/model"
	"go-admin/internal/utils"

	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) Login(username, password string) (*model.User, error) {
	// 查找用户
	var user model.User
	if err := s.db.Where("username = ? AND status = '1'", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("用户不存在或已被禁用")
		}
		return nil, err
	}

	// 验证密码
	if !utils.CheckPasswordHash(password, user.Password) {
		return nil, errors.New("密码错误")
	}

	// 预加载关联数据
	s.db.Preload("Roles").Preload("Organizations").First(&user, user.ID)

	return &user, nil
}

func CheckUserPermission(userID int64, path, method string) (bool, error) {
	// 这里实现权限检查逻辑
	// 可以根据用户的角色和菜单权限来判断
	return true, nil
}
