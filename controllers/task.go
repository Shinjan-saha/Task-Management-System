package controllers

import (
	"go-task-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var input struct {
		Title string
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	task := models.Task{Title: input.Title, UserID: userID}
	models.DB.Create(&task)
	c.JSON(http.StatusOK, task)
}

func GetTasks(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var tasks []models.Task
	models.DB.Where("user_id = ?", userID).Find(&tasks)

	c.JSON(http.StatusOK, tasks)
}

func UpdateTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var task models.Task
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input struct {
		Title     string
		Completed bool
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	task.Title = input.Title
	task.Completed = input.Completed
	models.DB.Save(&task)

	c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	id := c.Param("id")

	var task models.Task
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	models.DB.Delete(&task)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
