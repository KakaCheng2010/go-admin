package service

import (
	"go-admin/internal/model"
	"go-admin/internal/utils"
	"strconv"

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

	// 计算路径：与组织相同的规则
	if menu.ParentID != nil {
		var parent model.Menu
		if err := s.db.First(&parent, *menu.ParentID).Error; err != nil {
			return err
		}
		menu.Path = parent.Path + "/" + strconv.FormatInt(menu.ID, 10)
	} else {
		menu.Path = strconv.FormatInt(menu.ID, 10)
	}

	return s.db.Create(menu).Error
}

func (s *MenuService) GetMenuByID(id int64) (*model.Menu, error) {
	var menu model.Menu
	err := s.db.Preload("Parent").Preload("Children").First(&menu, id).Error
	return &menu, err
}

func (s *MenuService) UpdateMenu(menu *model.Menu) error {
	// 读取旧值用于比较与更新子节点路径
	var old model.Menu
	if err := s.db.First(&old, menu.ID).Error; err != nil {
		return err
	}

	// 重新计算当前节点路径
	var newPath string
	if menu.ParentID != nil {
		var parent model.Menu
		if err := s.db.First(&parent, *menu.ParentID).Error; err != nil {
			return err
		}
		newPath = parent.Path + "/" + strconv.FormatInt(menu.ID, 10)
	} else {
		newPath = strconv.FormatInt(menu.ID, 10)
	}

	// 保存自身变更
	menu.Path = newPath
	if err := s.db.Save(menu).Error; err != nil {
		return err
	}

	// 如果路径发生变化，批量更新所有子孙节点路径前缀
	if old.Path != newPath {
		oldPrefix := old.Path + "/"
		newPrefix := newPath + "/"
		if err := s.db.Model(&model.Menu{}).
			Where("path LIKE ?", oldPrefix+"%").
			Update("path", gorm.Expr("REPLACE(path, ?, ?)", oldPrefix, newPrefix)).Error; err != nil {
			return err
		}
	}

	return nil
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
