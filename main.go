package main

import (
	"go-task-api/controllers"
	"go-task-api/middleware"
	"go-task-api/models"
	  "log"
     "github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
   if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }
	models.ConnectDatabase()

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	auth := r.Group("/")
	auth.Use(middleware.JWTAuthMiddleware())

	auth.POST("/tasks", controllers.CreateTask)
	auth.GET("/tasks", controllers.GetTasks)
	auth.PUT("/tasks/:id", controllers.UpdateTask)
	auth.DELETE("/tasks/:id", controllers.DeleteTask)

	r.Run(":8080")
}
