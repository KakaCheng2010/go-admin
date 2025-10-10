package service

import (
	"go-admin/internal/model"
	"go-admin/internal/utils"

	"gorm.io/gorm"
)

type MenuService struct {
	db *gorm.DB
}

func NewMenuService(db *gorm.DB) *MenuService {
	return &MenuService{db: db}
}

func (s *MenuService) CreateMenu(menu *model.Menu) error {
	// 生成雪花ID
	menu.ID = utils.GenerateID()
	return s.db.Create(menu).Error
}

func (s *MenuService) GetMenuByID(id int64) (*model.Menu, error) {
	var menu model.Menu
	err := s.db.Preload("Parent").Preload("Children").First(&menu, id).Error
	return &menu, err
}

func (s *MenuService) UpdateMenu(menu *model.Menu) error {
	return s.db.Save(menu).Error
}

func (s *MenuService) DeleteMenu(id int64) error {
	return s.db.Delete(&model.Menu{}, id).Error
}

func (s *MenuService) ListMenus() ([]model.Menu, error) {
	var menus []model.Menu
	err := s.db.Preload("Parent").Preload("Children").Find(&menus).Error
	return menus, err
}

func (s *MenuService) GetMenuTree() ([]model.Menu, error) {
	var menus []model.Menu
	err := s.db.Where("parent_id IS NULL").Preload("Children").Find(&menus).Error
	return menus, err
}
