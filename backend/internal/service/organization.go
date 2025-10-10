package service

import (
	"fmt"
	"go-admin/internal/model"

	"gorm.io/gorm"
)

type OrganizationService struct {
	db *gorm.DB
}

func NewOrganizationService(db *gorm.DB) *OrganizationService {
	return &OrganizationService{db: db}
}

func (s *OrganizationService) CreateOrganization(org *model.Organization) error {
	// 验证父组织是否存在（应用层数据完整性检查）
	if org.ParentID != nil {
		var parentOrg model.Organization
		if err := s.db.First(&parentOrg, *org.ParentID).Error; err != nil {
			return fmt.Errorf("父组织不存在")
		}
	}

	return s.db.Create(org).Error
}

func (s *OrganizationService) GetOrganizationByID(id int64) (*model.Organization, error) {
	var org model.Organization
	err := s.db.Preload("Parent").Preload("Children").First(&org, id).Error
	return &org, err
}

func (s *OrganizationService) UpdateOrganization(org *model.Organization) error {
	// 验证父组织是否存在（应用层数据完整性检查）
	if org.ParentID != nil {
		var parentOrg model.Organization
		if err := s.db.First(&parentOrg, *org.ParentID).Error; err != nil {
			return fmt.Errorf("父组织不存在")
		}

		// 防止循环引用
		if *org.ParentID == org.ID {
			return fmt.Errorf("不能将自己设为父组织")
		}
	}

	return s.db.Save(org).Error
}

func (s *OrganizationService) DeleteOrganization(id int64) error {
	// 检查是否有子组织
	var childCount int64
	if err := s.db.Model(&model.Organization{}).Where("parent_id = ?", id).Count(&childCount).Error; err != nil {
		return err
	}

	if childCount > 0 {
		return fmt.Errorf("该组织下还有子组织，无法删除")
	}

	// 检查是否有关联用户
	var userCount int64
	if err := s.db.Table("user_organizations").Where("organization_id = ?", id).Count(&userCount).Error; err != nil {
		return err
	}

	if userCount > 0 {
		return fmt.Errorf("该组织下还有用户，无法删除")
	}

	return s.db.Delete(&model.Organization{}, id).Error
}

func (s *OrganizationService) SoftDeleteOrganization(id int64, operatorID int64) error {
	// 标记删除人
	if err := s.db.Model(&model.Organization{}).Where("id = ?", id).Update("deleted_by", operatorID).Error; err != nil {
		return err
	}
	return s.DeleteOrganization(id)
}

func (s *OrganizationService) ListOrganizations() ([]model.Organization, error) {
	var orgs []model.Organization
	err := s.db.Preload("Parent").Preload("Children").Order("sort ASC, id ASC").Find(&orgs).Error
	return orgs, err
}

func (s *OrganizationService) GetOrganizationTree() ([]model.Organization, error) {
	var orgs []model.Organization
	err := s.db.Where("parent_id IS NULL").Preload("Children").Order("sort ASC, id ASC").Find(&orgs).Error
	return orgs, err
}
