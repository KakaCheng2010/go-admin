package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func CacheMiddleware(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只对GET请求进行缓存
		if c.Request.Method != "GET" {
			c.Next()
			return
		}

		// 生成缓存键
		cacheKey := fmt.Sprintf("cache:%s:%s", c.Request.Method, c.Request.URL.Path)

		// 尝试从缓存获取
		ctx := context.Background()
		cached, err := rdb.Get(ctx, cacheKey).Result()
		if err == nil {
			// 缓存命中，直接返回
			var data interface{}
			if err := json.Unmarshal([]byte(cached), &data); err == nil {
				c.JSON(http.StatusOK, data)
				c.Abort()
				return
			}
		}

		// 缓存未命中，继续处理请求
		c.Next()
	}
}

func SetCacheMiddleware(rdb *redis.Client, expiration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只对GET请求设置缓存
		if c.Request.Method != "GET" {
			c.Next()
			return
		}

		// 等待响应完成
		c.Next()

		// 检查响应状态
		if c.Writer.Status() != http.StatusOK {
			return
		}

		// 获取响应数据
		responseData := c.Keys["response_data"]
		if responseData == nil {
			return
		}

		// 设置缓存
		cacheKey := fmt.Sprintf("cache:%s:%s", c.Request.Method, c.Request.URL.Path)
		ctx := context.Background()

		if data, err := json.Marshal(responseData); err == nil {
			rdb.Set(ctx, cacheKey, data, expiration)
		}
	}
}
