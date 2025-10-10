package main

import (
	"fmt"
	"go-admin/internal/utils"
)

func main() {
	// 初始化雪花ID生成器
	utils.InitSnowflake()

	fmt.Println("测试雪花ID生成器...")
	fmt.Println("生成5个ID：")
	fmt.Println()

	for i := 0; i < 5; i++ {
		id := utils.GenerateID()
		fmt.Printf("ID %d: %d (最后3位: %d)\n", i+1, id, id%1000)
	}

	fmt.Println()
	fmt.Println("验证：所有ID的最后3位都不应该为0")
}
