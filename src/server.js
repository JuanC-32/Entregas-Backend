import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import ProductManager from "./managers/ProductManager.js";

const server = http.createServer(app);
const io = new Server(server);

app.set("io", io); // 👈 compartir io con rutas

const productManager = new ProductManager("./src/data/products.json");

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.emit("products", await productManager.getProducts());

  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data);
    io.emit("products", await productManager.getProducts());
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.emit("products", await productManager.getProducts());
  });
});

server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
