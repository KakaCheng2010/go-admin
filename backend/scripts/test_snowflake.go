package main

import (
	"fmt"
	"go-admin/internal/utils"
	"log"
)

func main() {
	// 初始化雪花ID生成器
	if err := utils.InitSnowflake(); err != nil {
		log.Fatal("雪花ID生成器初始化失败:", err)
	}

	fmt.Println("测试雪花ID生成器...")
	fmt.Println("生成10个ID：")
	fmt.Println()

	for i := 0; i < 10; i++ {
		id := utils.GenerateID()
		fmt.Printf("ID %d: %d\n", i+1, id)
	}

	fmt.Println()
	fmt.Println("验证：所有ID都不应该为0")
}
