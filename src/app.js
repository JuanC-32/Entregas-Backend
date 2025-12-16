import express from "express";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";

const app = express();

// 🔹 Handlebars config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));

// 🔹 Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);

export default app;

