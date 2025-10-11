package service

import (
	"go-admin/internal/model"

	"gorm.io/gorm"
)

type DictService struct {
	db *gorm.DB
}

func NewDictService(db *gorm.DB) *DictService {
	return &DictService{db: db}
}

func (s *DictService) CreateDict(dict *model.Dict) error {
	return s.db.Create(dict).Error
}

func (s *DictService) GetDictByID(id uint) (*model.Dict, error) {
	var dict model.Dict
	err := s.db.Preload("Items").First(&dict, id).Error
	return &dict, err
}

func (s *DictService) UpdateDict(dict *model.Dict) error {
	return s.db.Save(dict).Error
}

func (s *DictService) DeleteDict(id uint) error {
	return s.db.Delete(&model.Dict{}, id).Error
}

func (s *DictService) ListDicts() ([]model.Dict, error) {
	var dicts []model.Dict
	err := s.db.Preload("Items").Find(&dicts).Error
	return dicts, err
}

func (s *DictService) GetDictByCode(code string) (*model.Dict, error) {
	var dict model.Dict
	err := s.db.Preload("Items").Where("code = ?", code).First(&dict).Error
	return &dict, err
}

// 字典项管理
func (s *DictService) CreateDictItem(item *model.DictItem) error {
	return s.db.Create(item).Error
}

func (s *DictService) GetDictItemByID(id uint) (*model.DictItem, error) {
	var item model.DictItem
	err := s.db.Preload("Dict").First(&item, id).Error
	return &item, err
}

func (s *DictService) UpdateDictItem(item *model.DictItem) error {
	return s.db.Save(item).Error
}

func (s *DictService) DeleteDictItem(id uint) error {
	return s.db.Delete(&model.DictItem{}, id).Error
}

func (s *DictService) ListDictItems(dictID uint) ([]model.DictItem, error) {
	var items []model.DictItem
	err := s.db.Where("dict_id = ?", dictID).Preload("Dict").Find(&items).Error
	return items, err
}

// 获取所有字典及其字典项（一次性查询）
func (s *DictService) GetAllDictsWithItems() ([]model.Dict, error) {
	var dicts []model.Dict
	err := s.db.Preload("Items").Find(&dicts).Error
	return dicts, err
}
