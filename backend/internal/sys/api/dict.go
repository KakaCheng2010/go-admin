package api

import (
	"net/http"
	"siqian-admin/internal/sys/model"
	"siqian-admin/internal/sys/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DictHandler struct {
	dictService *service.DictService
}

func NewDictHandler(dictService *service.DictService) *DictHandler {
	return &DictHandler{dictService: dictService}
}

type CreateDictRequest struct {
	Name        string `json:"name" binding:"required"`
	Code        string `json:"code" binding:"required"`
	Description string `json:"description"`
	Status      int    `json:"status"`
}

type UpdateDictRequest struct {
	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
	Status      int    `json:"status"`
}

type CreateDictItemRequest struct {
	DictID string `json:"dict_id" binding:"required"`
	Label  string `json:"label" binding:"required"`
	Value  string `json:"value" binding:"required"`
	Sort   int    `json:"sort"`
	Status int    `json:"status"`
}

type UpdateDictItemRequest struct {
	Label  string `json:"label"`
	Value  string `json:"value"`
	Sort   int    `json:"sort"`
	Status int    `json:"status"`
}

// 字典管理
func (h *DictHandler) CreateDict(c *gin.Context) {
	var req CreateDictRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dict := &model.Dict{
		Name:        req.Name,
		Code:        req.Code,
		Description: req.Description,
		Status:      req.Status,
	}

	if err := h.dictService.CreateDict(dict); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "字典创建成功", "dict": dict})
}

func (h *DictHandler) GetDict(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典ID"})
		return
	}

	dict, err := h.dictService.GetDictByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "字典不存在"})
		return
	}

	c.JSON(http.StatusOK, dict)
}

func (h *DictHandler) UpdateDict(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典ID"})
		return
	}

	var req UpdateDictRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dict, err := h.dictService.GetDictByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "字典不存在"})
		return
	}

	dict.Name = req.Name
	dict.Code = req.Code
	dict.Description = req.Description
	dict.Status = req.Status

	if err := h.dictService.UpdateDict(dict); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "dict": dict})
}

func (h *DictHandler) DeleteDict(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典ID"})
		return
	}

	if err := h.dictService.DeleteDict(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *DictHandler) ListDicts(c *gin.Context) {
	dicts, err := h.dictService.ListDicts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取字典列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dicts": dicts})
}

func (h *DictHandler) GetDictByCode(c *gin.Context) {
	code := c.Param("code")
	dict, err := h.dictService.GetDictByCode(code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "字典不存在"})
		return
	}

	c.JSON(http.StatusOK, dict)
}

// 字典项管理
func (h *DictHandler) CreateDictItem(c *gin.Context) {
	var req CreateDictItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 兼容两种来源：优先使用路径参数 /dicts/:id/items，其次使用 body.dict_id
	idParam := c.Param("id")
	var idSource string
	if idParam != "" {
		idSource = idParam
	} else {
		idSource = req.DictID
	}

	// 解析字典ID（字符串 -> uint）
	dictID64, err := strconv.ParseUint(idSource, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "字典ID格式错误"})
		return
	}

	item := &model.DictItem{
		DictID: uint(dictID64),
		Label:  req.Label,
		Value:  req.Value,
		Sort:   req.Sort,
		Status: req.Status,
	}

	if err := h.dictService.CreateDictItem(item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "字典项创建成功", "item": item})
}

func (h *DictHandler) GetDictItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典项ID"})
		return
	}

	item, err := h.dictService.GetDictItemByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "字典项不存在"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func (h *DictHandler) UpdateDictItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典项ID"})
		return
	}

	var req UpdateDictItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item, err := h.dictService.GetDictItemByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "字典项不存在"})
		return
	}

	item.Label = req.Label
	item.Value = req.Value
	item.Sort = req.Sort
	item.Status = req.Status

	if err := h.dictService.UpdateDictItem(item); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "更新成功", "item": item})
}

func (h *DictHandler) DeleteDictItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典项ID"})
		return
	}

	if err := h.dictService.DeleteDictItem(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func (h *DictHandler) ListDictItems(c *gin.Context) {
	// 路由为 /dicts/:id/items，这里应读取 id 参数
	dictID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的字典ID"})
		return
	}

	items, err := h.dictService.ListDictItems(uint(dictID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取字典项列表失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

// 获取所有字典及其字典项（一次性查询）
func (h *DictHandler) GetAllDictsWithItems(c *gin.Context) {
	dicts, err := h.dictService.GetAllDictsWithItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取所有字典失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dicts": dicts})
}
