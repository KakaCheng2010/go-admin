package utils

import (
	"sync"
	"time"
)

const (
	// 时间戳位数
	timestampBits = 41
	// 机器ID位数
	machineIDBits = 10
	// 序列号位数
	sequenceBits = 12

	// 最大值
	maxMachineID = (1 << machineIDBits) - 1
	maxSequence  = (1 << sequenceBits) - 1

	// 位移
	machineIDShift = sequenceBits
	timestampShift = sequenceBits + machineIDBits

	// 起始时间戳 (2020-01-01 00:00:00 UTC)
	epoch = 1577836800000
)

var (
	mu        sync.Mutex
	sequence  int64
	lastTime  int64
	machineID int64 = 1 // 机器ID，可以根据需要配置
)

// InitSnowflake 初始化雪花ID生成器
func InitSnowflake() error {
	// 简单实现，不需要特殊初始化
	return nil
}

// GenerateID 生成雪花ID
func GenerateID() int64 {
	mu.Lock()
	defer mu.Unlock()

	now := time.Now().UnixMilli()

	if now < lastTime {
		// 时钟回拨，等待
		time.Sleep(time.Duration(lastTime-now) * time.Millisecond)
		now = time.Now().UnixMilli()
	}

	if now == lastTime {
		sequence = (sequence + 1) & maxSequence
		if sequence == 0 {
			// 序列号溢出，等待下一毫秒
			for now <= lastTime {
				now = time.Now().UnixMilli()
			}
		}
	} else {
		sequence = 0
	}

	lastTime = now

	// 生成ID
	id := ((now - epoch) << timestampShift) |
		(machineID << machineIDShift) |
		sequence

	// 确保ID不为0，并且后面几位不为0
	if id == 0 {
		id = 1
	}

	// 确保ID的最后几位不为0，避免查找问题
	if id%1000 == 0 {
		id = id + 1
	}

	return id
}
