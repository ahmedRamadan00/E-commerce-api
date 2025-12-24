# E-Commerce REST API

A complete Node.js RESTful API for an e-commerce platform built with Express.js and MongoDB.

## 📋 Features

- **User Management**: Create, read, update, and delete user accounts
- **Product Catalog**: Full CRUD operations for products
- **Order System**: Create and manage customer orders
- **Validation**: Input validation using Mongoose schemas
- **Error Handling**: Centralized error handling middleware
- **RESTful Design**: Clean REST API structure

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **dotenv**

---

## 📁 Project Structure
├── src/
│ ├── controllers/
│ │ ├── user.controller.js
│ │ ├── product.controller.js
│ │ └── order.controller.js
│ ├── models/
│ │ ├── user.model.js
│ │ ├── product.models.js
│ │ └── order.models.js
│ └── routes/
│ ├── user.route.js
│ ├── product.route.js
│ └── order.route.js
├── index.js
├── package.json
├── package-lock.json
├── .env
└── README.md

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or MongoDB Atlas)
- npm

---

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nodejs-project

## 📚 API Endpoints

### Users
GET    /users  
GET    /users/:id  
POST   /users  
PUT    /users/:id  
DELETE /users/:id  

### Products
GET    /products  
GET    /products/:id  
POST   /products  
PUT    /products/:id  
DELETE /products/:id  

### Orders
POST   /orders  
GET    /orders/:id  
PUT    /orders/:id  
DELETE /orders/:id  


