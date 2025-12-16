import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cm = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  res.json(await cm.createCart());
});

router.get("/:cid", async (req, res) => {
  res.json(await cm.getCartById(req.params.cid));
});

router.post("/:cid/product/:pid", async (req, res) => {
  res.json(await cm.addProductToCart(req.params.cid, req.params.pid));
});

export default router;
