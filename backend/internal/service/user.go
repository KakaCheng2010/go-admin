package service

import (
	"errors"
	"go-admin/internal/model"
	"go-admin/internal/utils"

	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(user *model.User) error {
	// 检查用户名是否已存在
	var existingUser model.User
	if err := s.db.Where("username = ?", user.Username).First(&existingUser).Error; err == nil {
		return errors.New("用户名已存在")
	}

	// 加密密码
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	return s.db.Create(user).Error
}

func (s *UserService) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	err := s.db.Preload("Roles").Preload("Organizations").First(&user, id).Error
	return &user, err
}

func (s *UserService) GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := s.db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (s *UserService) UpdateUser(user *model.User) error {
	return s.db.Save(user).Error
}

func (s *UserService) DeleteUser(id uint) error {
	return s.db.Delete(&model.User{}, id).Error
}

func (s *UserService) ListUsers(page, pageSize int) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	offset := (page - 1) * pageSize

	err := s.db.Model(&model.User{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = s.db.Offset(offset).Limit(pageSize).Find(&users).Error
	return users, total, err
}

func (s *UserService) ListUsersByOrganization(organizationID uint, page, pageSize int) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	offset := (page - 1) * pageSize

	// 统计该组织下的用户总数
	err := s.db.Model(&model.User{}).Where("organization_id = ?", organizationID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 查询该组织下的用户
	err = s.db.Where("organization_id = ?", organizationID).Offset(offset).Limit(pageSize).Find(&users).Error
	return users, total, err
}

func (s *UserService) AssignRoles(userID uint, roleIDs []uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}

	var roles []model.Role
	if err := s.db.Where("id IN ?", roleIDs).Find(&roles).Error; err != nil {
		return err
	}

	return s.db.Model(&user).Association("Roles").Replace(roles)
}

func (s *UserService) AssignOrganizations(userID uint, orgIDs []uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}

	var orgs []model.Organization
	if err := s.db.Where("id IN ?", orgIDs).Find(&orgs).Error; err != nil {
		return err
	}

	return s.db.Model(&user).Association("Organizations").Replace(orgs)
}
