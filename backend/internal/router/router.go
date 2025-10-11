package router

import (
	"go-admin/internal/api"
	"go-admin/internal/config"
	"go-admin/internal/middleware"
	"go-admin/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

func SetupRouter(cfg *config.Config, db *gorm.DB, rdb *redis.Client) *gin.Engine {
	r := gin.Default()

	// 初始化服务
	authService := service.NewAuthService(db)
	userService := service.NewUserService(db)
	orgService := service.NewOrganizationService(db)
	roleService := service.NewRoleService(db)
	menuService := service.NewMenuService(db)
	dictService := service.NewDictService(db)

	// 初始化处理器
	authHandler := api.NewAuthHandler(authService)
	userHandler := api.NewUserHandler(userService)
	orgHandler := api.NewOrganizationHandler(orgService)
	roleHandler := api.NewRoleHandler(roleService)
	menuHandler := api.NewMenuHandler(menuService)
	dictHandler := api.NewDictHandler(dictService)

	// API路由组
	v1 := r.Group("/api/v1")
	{
		// 认证路由（不需要JWT验证）
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
		}

		// 需要认证的路由
		authorized := v1.Group("/")
		authorized.Use(middleware.AuthMiddleware())
		{
			// 用户管理
			users := authorized.Group("/users")
			{
				users.POST("", userHandler.CreateUser)
				users.GET("", userHandler.ListUsers)
				users.GET("/:id", userHandler.GetUser)
				users.PUT("/:id", userHandler.UpdateUser)
				users.DELETE("/:id", userHandler.DeleteUser)
				users.DELETE("/batch", userHandler.BatchDeleteUsers)
				users.POST("/:id/roles", userHandler.AssignRoles)
			}

			// 组织管理
			organizations := authorized.Group("/organizations")
			{
				organizations.POST("", orgHandler.CreateOrganization)
				organizations.GET("", orgHandler.ListOrganizations)
				organizations.GET("/tree", orgHandler.GetOrganizationTree)
				organizations.GET("/:id", orgHandler.GetOrganization)
				organizations.PUT("/:id", orgHandler.UpdateOrganization)
				organizations.DELETE("/:id", orgHandler.DeleteOrganization)
			}

			// 角色管理
			roles := authorized.Group("/roles")
			{
				roles.POST("", roleHandler.CreateRole)
				roles.GET("", roleHandler.ListRoles)
				roles.GET("/:id", roleHandler.GetRole)
				roles.PUT("/:id", roleHandler.UpdateRole)
				roles.DELETE("/:id", roleHandler.DeleteRole)
				roles.POST("/:id/menus", roleHandler.AssignMenus)
				roles.POST("/:id/users", roleHandler.AssignUsers)
			}

			// 菜单管理
			menus := authorized.Group("/menus")
			{
				menus.POST("", menuHandler.CreateMenu)
				menus.GET("", menuHandler.ListMenus)
				menus.GET("/tree", menuHandler.GetMenuTree)
				menus.GET("/user", menuHandler.GetUserMenus) // 获取当前用户的菜单
				menus.GET("/:id", menuHandler.GetMenu)
				menus.PUT("/:id", menuHandler.UpdateMenu)
				menus.DELETE("/:id", menuHandler.DeleteMenu)
			}

			// 字典管理
			dicts := authorized.Group("/dicts")
			{
				dicts.POST("", dictHandler.CreateDict)
				dicts.GET("", dictHandler.ListDicts)
				dicts.GET("/code/:code", dictHandler.GetDictByCode)
				dicts.GET("/:id", dictHandler.GetDict)
				dicts.PUT("/:id", dictHandler.UpdateDict)
				dicts.DELETE("/:id", dictHandler.DeleteDict)

				// 字典项管理
				dicts.POST("/:id/items", dictHandler.CreateDictItem)
				dicts.GET("/:id/items", dictHandler.ListDictItems)
			}

			// 字典项管理（独立路由组避免冲突）
			dictItems := authorized.Group("/dict-items")
			{
				dictItems.POST("", dictHandler.CreateDictItem)
				dictItems.GET("/:id", dictHandler.GetDictItem)
				dictItems.PUT("/:id", dictHandler.UpdateDictItem)
				dictItems.DELETE("/:id", dictHandler.DeleteDictItem)
			}
		}
	}

	return r
}
