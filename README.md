# E-Commerce Project

Full-stack e-commerce application with Node.js backend and React frontend.

## 📁 Structure

```
ecommerce/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── order.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── product.models.js
│   │   │   └── order.models.js
│   │   └── routes/
│   │       ├── user.route.js
│   │       ├── product.route.js
│   │       └── order.route.js
│   ├── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── UsersPage.jsx
    │   │   └── OrdersPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env
```

## 🚀 Run the Project

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| GET    | /users          | Get all users      |
| POST   | /users          | Create user        |
| GET    | /users/:id      | Get user by ID     |
| PUT    | /users/:id      | Update user        |
| DELETE | /users/:id      | Delete user        |
| GET    | /products       | Get all products   |
| POST   | /products       | Create product     |
| GET    | /products/:id   | Get product by ID  |
| PUT    | /products/:id   | Update product     |
| DELETE | /products/:id   | Delete product     |
| POST   | /orders         | Create order       |
| GET    | /orders/:id     | Get order by ID    |
| PUT    | /orders/:id     | Update order       |
| DELETE | /orders/:id     | Delete order       |
