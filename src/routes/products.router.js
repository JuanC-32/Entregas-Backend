import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  res.json(await pm.getProducts());
});

router.post("/", async (req, res) => {
  const product = await pm.addProduct(req.body);
  req.io.emit("updateProducts", await pm.getProducts());
  res.json(product);
});

router.delete("/:pid", async (req, res) => {
  await pm.deleteProduct(req.params.pid);
  req.io.emit("updateProducts", await pm.getProducts());
  res.json({ status: "deleted" });
});

export default router;
