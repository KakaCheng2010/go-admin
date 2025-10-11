package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

var globalConfig *Config

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	Redis    RedisConfig    `mapstructure:"redis"`
	JWT      JWTConfig      `mapstructure:"jwt"`
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
	Secret     string `mapstructure:"secret"`
	ExpireTime int    `mapstructure:"expire_time"`
}

func Load() *Config {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")
	viper.AddConfigPath("../configs")    // 添加相对路径
	viper.AddConfigPath("../../configs") // 添加更多可能的路径

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

	// 打印当前工作目录和搜索路径
	if pwd, err := os.Getwd(); err == nil {
		fmt.Println("当前工作目录:", pwd)
	}
	fmt.Println("搜索配置文件路径:")
	for _, path := range []string{"./configs", ".", "../configs", "../../configs"} {
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
