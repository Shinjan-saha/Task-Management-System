package main

import (
	"go-task-api/controllers"
	"go-task-api/middleware"
	"go-task-api/models"
	  "log"
	  "os"
     "github.com/joho/godotenv"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
  if os.Getenv("DATABASE_URL") == "" { 
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found (this is okay in production)")
		}
	}
	models.ConnectDatabase()

r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello, server is running")
	})


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
