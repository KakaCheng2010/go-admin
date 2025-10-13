package service

import (
	"errors"
	"go-admin/internal/sys/model"
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

	// 生成雪花ID
	user.ID = utils.GenerateID()

	// 加密密码
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	return s.db.Create(user).Error
}

func (s *UserService) GetUserByID(id int64) (*model.User, error) {
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

func (s *UserService) DeleteUser(id int64) error {
	return s.db.Delete(&model.User{}, id).Error
}

func (s *UserService) SoftDeleteUser(id int64, operatorID int64) error {
	// 先更新 DeletedBy，再执行软删除
	if err := s.db.Model(&model.User{}).Where("id = ?", id).Update("deleted_by", operatorID).Error; err != nil {
		return err
	}
	return s.db.Delete(&model.User{}, id).Error
}

type UserFilters struct {
	Username string
	Phone    string
	Status   *string
}

func (s *UserService) ListUsers(page, pageSize int, filters *UserFilters) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	offset := (page - 1) * pageSize

	query := s.db.Model(&model.User{})
	// Apply filters
	if filters != nil {
		if filters.Username != "" {
			query = query.Where("username LIKE ?", "%"+filters.Username+"%")
		}
		if filters.Phone != "" {
			query = query.Where("phone LIKE ?", "%"+filters.Phone+"%")
		}
		if filters.Status != nil {
			query = query.Where("status = ?", *filters.Status)
		}
	}

	// 仅统计未软删除用户
	err := query.Where("deleted_at IS NULL").Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = query.Where("deleted_at IS NULL").Offset(offset).Limit(pageSize).Find(&users).Error
	return users, total, err
}

func (s *UserService) ListUsersByOrganization(organizationID int64, page, pageSize int) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	offset := (page - 1) * pageSize

	// 统计该组织下的未软删除用户总数
	err := s.db.Model(&model.User{}).Where("organization_id = ? AND deleted_at IS NULL", organizationID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 查询该组织下的未软删除用户
	err = s.db.Where("organization_id = ? AND deleted_at IS NULL", organizationID).Offset(offset).Limit(pageSize).Find(&users).Error
	return users, total, err
}

// ListUsersByOrganizationPath 根据组织路径查询用户（包含子组织）
func (s *UserService) ListUsersByOrganizationPath(organizationPath string, page, pageSize int, filters *UserFilters) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	offset := (page - 1) * pageSize

	// 构建查询条件：查找所有路径以指定路径开头的组织下的用户
	// 使用JOIN查询用户组织关联表和组织表
	baseQuery := `
        FROM sys_users u
        INNER JOIN sys_user_organizations uo ON u.id = uo.user_id
        INNER JOIN sys_organizations o ON uo.organization_id = o.id
        WHERE (o.path LIKE ? OR o.path = ?)
          AND u.deleted_at IS NULL
          AND o.deleted_at IS NULL
    `

	// 动态追加筛选条件
	whereParams := []interface{}{organizationPath + "%", organizationPath}
	filterSQL := ""
	if filters != nil {
		if filters.Username != "" {
			filterSQL += " AND u.username LIKE ?"
			whereParams = append(whereParams, "%"+filters.Username+"%")
		}
		if filters.Phone != "" {
			filterSQL += " AND u.phone LIKE ?"
			whereParams = append(whereParams, "%"+filters.Phone+"%")
		}
		if filters.Status != nil {
			filterSQL += " AND u.status = ?"
			whereParams = append(whereParams, *filters.Status)
		}
	}

	// 统计该组织及其子组织下的用户总数
	countSQL := "SELECT COUNT(DISTINCT u.id) " + baseQuery + filterSQL
	err := s.db.Raw(countSQL, whereParams...).Scan(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 查询该组织及其子组织下的用户
	listSQL := "SELECT DISTINCT u.* " + baseQuery + filterSQL + " LIMIT ? OFFSET ?"
	listParams := append(append([]interface{}{}, whereParams...), pageSize, offset)
	err = s.db.Raw(listSQL, listParams...).Scan(&users).Error
	return users, total, err
}

func (s *UserService) AssignRoles(userID int64, roleIDs []int64) error {
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

func (s *UserService) AssignOrganizations(userID int64, orgIDs []int64) error {
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
