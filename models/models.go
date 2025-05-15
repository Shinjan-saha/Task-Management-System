package models

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

type User struct {
	gorm.Model
	Username string `gorm:"unique"`
	Password string
	Tasks    []Task
}

type Task struct {
	gorm.Model
	Title     string
	Completed bool
	UserID    uint
}

func ConnectDatabase() {
	dsn := os.Getenv("DATABASE_URL") // Recommended way to manage secrets
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}

	err = db.AutoMigrate(&User{}, &Task{})
	if err != nil {
		panic(fmt.Sprintf("Failed to migrate database: %v", err))
	}

	DB = db
}
