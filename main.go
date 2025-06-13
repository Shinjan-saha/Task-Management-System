package main

import (
	"go-task-api/controllers"
	"go-task-api/middleware"
	"go-task-api/models"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	
	if os.Getenv("DATABASE_URL") == "" {
		if err := godotenv.Load(); err != nil {
			log.Println("No .env file found (this is okay in production)")
		}
	}

	
	models.ConnectDatabase()

	
	r.Use(CORSMiddleware())

	
	p := ginprometheus.NewPrometheus("gin") 
	p.Use(r)                                

	
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
