const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
const userRoutes = require("./src/routes/user.route");
const orderRoutes = require("./src/routes/order.route");
const productRoutes = require("./src/routes/product.route");
require("dotenv").config();

server.use(cors());
server.use(express.json());

server.use("/", userRoutes);
server.use("/", orderRoutes);
server.use("/", productRoutes);

// 404 Not Found middleware
server.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
server.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('DB Connected Successfully');
        server.listen(process.env.PORT, () => {
            console.log("Express server listening on port " + process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });
