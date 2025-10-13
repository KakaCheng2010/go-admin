package service

import (
	"go-admin/internal/sys/model"
	"go-admin/internal/utils"

	"gorm.io/gorm"
)

type RoleService struct {
	db *gorm.DB
}

func NewRoleService(db *gorm.DB) *RoleService {
	return &RoleService{db: db}
}

func (s *RoleService) CreateRole(role *model.Role) error {
	// 生成雪花ID
	role.ID = utils.GenerateID()
	return s.db.Create(role).Error
}

func (s *RoleService) GetRoleByID(id int64) (*model.Role, error) {
	var role model.Role
	err := s.db.Preload("Users").Preload("Menus").First(&role, id).Error
	return &role, err
}

func (s *RoleService) UpdateRole(role *model.Role) error {
	return s.db.Save(role).Error
}

func (s *RoleService) DeleteRole(id int64) error {
	return s.db.Delete(&model.Role{}, id).Error
}

func (s *RoleService) ListRoles() ([]model.Role, error) {
	var roles []model.Role
	err := s.db.Find(&roles).Error
	return roles, err
}

func (s *RoleService) AssignMenus(roleID int64, menuIDs []int64) error {
	var role model.Role
	if err := s.db.First(&role, roleID).Error; err != nil {
		return err
	}

	var menus []model.Menu
	if err := s.db.Where("id IN ?", menuIDs).Find(&menus).Error; err != nil {
		return err
	}

	// 清除现有关联
	if err := s.db.Model(&role).Association("Menus").Clear(); err != nil {
		return err
	}

	// 添加新关联
	if len(menus) > 0 {
		if err := s.db.Model(&role).Association("Menus").Append(menus); err != nil {
			return err
		}
	}

	return nil
}

func (s *RoleService) AssignUsers(roleID int64, userIDs []int64) error {
	var role model.Role
	if err := s.db.First(&role, roleID).Error; err != nil {
		return err
	}

	var users []model.User
	if err := s.db.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
		return err
	}

	// 清除现有关联
	if err := s.db.Model(&role).Association("Users").Clear(); err != nil {
		return err
	}

	// 添加新关联
	if len(users) > 0 {
		if err := s.db.Model(&role).Association("Users").Append(users); err != nil {
			return err
		}
	}

	return nil
}
