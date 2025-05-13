package models

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
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
	db, err := gorm.Open(sqlite.Open("tasks.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&User{}, &Task{})
	DB = db
}
