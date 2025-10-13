package config

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

var globalConfig *Config

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Upload   UploadConfig   `mapstructure:"upload"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Password string `mapstructure:"password"`
	DB       int    `mapstructure:"db"`
}

type JWTConfig struct {
	Secret              string `mapstructure:"secret"`
	ExpireTime          int    `mapstructure:"expire_time"`
	RefreshAheadSeconds int    `mapstructure:"refresh_ahead_seconds"`
}

type UploadConfig struct {
	AvatarPath   string   `mapstructure:"avatar_path"`
	MaxSize      int64    `mapstructure:"max_size"`
	AllowedTypes []string `mapstructure:"allowed_types"`
}

func Load() *Config {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	// 获取可执行文件所在目录
	execPath, err := os.Executable()
	if err == nil {
		execDir := filepath.Dir(execPath)
		// 打包后的配置文件查找路径
		viper.AddConfigPath(execDir)                              // 可执行文件同目录
		viper.AddConfigPath(filepath.Join(execDir, "configs"))    // 可执行文件同目录下的configs文件夹
		viper.AddConfigPath(filepath.Join(execDir, ".."))         // 可执行文件上级目录
		viper.AddConfigPath(filepath.Join(execDir, "../configs")) // 可执行文件上级目录下的configs文件夹
	}

	// 开发环境的配置文件查找路径
	viper.AddConfigPath(".")         // 当前工作目录
	viper.AddConfigPath("./configs") // 当前目录下的configs文件夹
	viper.AddConfigPath("../")       // 上级目录
	viper.AddConfigPath("../../")    // 上两级目录

	// 设置默认值
	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.mode", "debug")
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.user", "postgres")
	viper.SetDefault("database.password", "password")
	viper.SetDefault("database.dbname", "go_admin")
	viper.SetDefault("database.sslmode", "disable")
	viper.SetDefault("redis.host", "localhost")
	viper.SetDefault("redis.port", 6379)
	viper.SetDefault("redis.password", "")
	viper.SetDefault("redis.db", 0)
	viper.SetDefault("jwt.secret", "your-secret-key")
	viper.SetDefault("jwt.expire_time", 24)
	// 当 token 剩余有效期小于该阈值（秒）时，自动续期
	viper.SetDefault("jwt.refresh_ahead_seconds", 900) // 15 分钟
	viper.SetDefault("upload.avatar_path", "uploads/avatars/")
	viper.SetDefault("upload.max_size", 5242880) // 5MB
	viper.SetDefault("upload.allowed_types", []string{"image/jpeg", "image/png", "image/gif"})

	// 打印当前工作目录和搜索路径
	if pwd, err := os.Getwd(); err == nil {
		fmt.Println("当前工作目录:", pwd)
	}
	if execPath, err := os.Executable(); err == nil {
		fmt.Println("可执行文件路径:", execPath)
		fmt.Println("可执行文件目录:", filepath.Dir(execPath))
	}
	fmt.Println("搜索配置文件路径:")
	// 显示配置的搜索路径
	searchPaths := []string{
		".", "./configs", "../", "../../",
	}
	if execPath, err := os.Executable(); err == nil {
		execDir := filepath.Dir(execPath)
		searchPaths = append([]string{
			execDir,
			filepath.Join(execDir, "configs"),
			filepath.Join(execDir, ".."),
			filepath.Join(execDir, "../configs"),
		}, searchPaths...)
	}
	for _, path := range searchPaths {
		fmt.Printf("  - %s\n", path)
	}

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			panic(err)
		}
		fmt.Println("警告: 配置文件未找到，使用默认配置")
		fmt.Println("错误详情:", err)
	} else {
		fmt.Println("配置文件加载成功:", viper.ConfigFileUsed())
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		panic(err)
	}

	// 打印配置信息用于调试
	fmt.Printf("数据库配置: host=%s, port=%d, user=%s, dbname=%s\n",
		config.Database.Host, config.Database.Port, config.Database.User, config.Database.DBName)

	globalConfig = &config
	return &config
}

func GetConfig() *Config {
	if globalConfig == nil {
		panic("配置未初始化，请先调用 Load() 函数")
	}
	return globalConfig
}
