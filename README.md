# ✅ Task Management Backend in Go (Gin + JWT)

This is a simple **Task Management REST API** built using **Go**, the **Gin web framework**, and **JWT-based authentication**. It allows users to:

- Register and login  
- Create, update, and delete their own tasks  
- Secure endpoints using JWT  
 

---

## 📦 Tech Stack

- **Go** (Golang)  
- **Gin** (HTTP web framework)  
- **GORM** (ORM for SQLite/MySQL/PostgreSQL)  
- **JWT** (Authentication)  
- **SQLite** (Default DB for local testing, can swap with Postgres/MySQL)  

---

## 🚀 Getting Started

```bash

git clone https://github.com/your-username/task-manager-go.git
cd task-manager-go
```

```bash
go mod tidy
```

```bash 
go run main.go
```


# 📚 API Documentation

## 🔐 Authentication Routes

---

### `POST /register` — Register a New User

**Request Body:**

```json
{
  "name": "Shinjan",
  "email": "shinjan@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Registration successful"
}
```

### `POST /login` — Login a  User

**Request Body:**

```json
{
  "email": "shinjan@example.com",
  "password": "securepass123"
}
```
**Response:**

```json
{
  "token": "JWT_TOKEN_STRING"
}
```

Use the token returned here in the Authorization header to access protected endpoints:

```bash
Authorization: Bearer <JWT_TOKEN_STRING>
```
✅ Task Routes (Require Authorization)

All task routes require the Authorization header with a valid JWT token.

### `GET /tasks` — Get All Tasks for Logged-in User



**Response:**

```json
[
  {
    "ID": 1,
    "Title": "Complete Streamlit UI",
    "Completed": false,
    "UserID": 1
  }
]

```

### `POST /tasks` — Create a New Task


**Request Body:**

```json
{
  "title": "Complete Streamlit UI",
  "completed": false
}
```


**Response:**

```json
{
  "message": "Task created successfully"
}
```

### `PUT /tasks/{id}` — Update a Task


**Example Path:**

```json
PUT /tasks/1
```

**Request Body:**

```json
{
  "title": "Update Streamlit Frontend",
  "completed": true
}
```
**Response:**
```json
{
  "message": "Task updated successfully"
}
```
### `DELETE /tasks/{id}` — Delete a Task

**Example Path:**

```json
DELETE /tasks/1
```

**Response:**

```json
{
  "message": "Task deleted successfully"
}
```

## Import these JSON File in POSTMAN & Test Them:-

[![Run in Postman](https://run.pstmn.io/button.svg)](./Task-Management-Go.postman_collection.json)

